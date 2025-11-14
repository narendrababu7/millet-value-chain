from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os
from datetime import datetime, timedelta
import requests

app = Flask(__name__)

# Global variables for ML models
models = {}
scalers = {}
price_data = {}

def initialize_models():
    """Initialize ML models for different millet types"""
    millet_types = ['Pearl Millet', 'Finger Millet', 'Foxtail Millet', 'Little Millet', 'Proso Millet']
    
    for millet_type in millet_types:
        # Create sample data for demonstration
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic features
        data = {
            'date': pd.date_range(start='2023-01-01', periods=n_samples, freq='D'),
            'seasonal_factor': np.sin(2 * np.pi * np.arange(n_samples) / 365),
            'demand_factor': np.random.normal(1.0, 0.2, n_samples),
            'supply_factor': np.random.normal(1.0, 0.15, n_samples),
            'weather_factor': np.random.normal(1.0, 0.1, n_samples),
            'market_trend': np.linspace(1.0, 1.3, n_samples) + np.random.normal(0, 0.05, n_samples),
            'government_subsidy': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
        }
        
        # Generate target prices based on features
        base_price = {
            'Pearl Millet': 45,
            'Finger Millet': 65,
            'Foxtail Millet': 55,
            'Little Millet': 50,
            'Proso Millet': 48
        }
        
        target = base_price[millet_type] * (
            data['seasonal_factor'] * 
            data['demand_factor'] * 
            data['supply_factor'] * 
            data['weather_factor'] * 
            data['market_trend'] * 
            (1 + data['government_subsidy'] * 0.1)
        )
        
        # Create DataFrame
        df = pd.DataFrame(data)
        df['price'] = target
        
        # Prepare features
        feature_columns = ['seasonal_factor', 'demand_factor', 'supply_factor', 
                          'weather_factor', 'market_trend', 'government_subsidy']
        X = df[feature_columns]
        y = df['price']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        # Store model and scaler
        models[millet_type] = model
        scalers[millet_type] = scaler
        
        # Store historical data
        price_data[millet_type] = df
        
        print(f"Model trained for {millet_type}")

@app.route('/predict-price', methods=['POST'])
def predict_price():
    """Predict millet price based on various factors"""
    try:
        data = request.get_json()
        
        millet_type = data.get('millet_type')
        days_ahead = data.get('days_ahead', 7)
        state = data.get('state', 'Bihar')
        district = data.get('district', 'Muzaffarpur')
        
        if not millet_type:
            return jsonify({'error': 'Millet type is required'}), 400
        
        if millet_type not in models:
            return jsonify({'error': f'Model not available for {millet_type}'}), 400
        
        # Get current date
        current_date = datetime.now()
        future_date = current_date + timedelta(days=days_ahead)
        
        # Calculate seasonal factor
        day_of_year = future_date.timetuple().tm_yday
        seasonal_factor = np.sin(2 * np.pi * day_of_year / 365)
        
        # Simulate other factors (in real implementation, these would come from external APIs)
        demand_factor = np.random.normal(1.0, 0.2)
        supply_factor = np.random.normal(1.0, 0.15)
        weather_factor = np.random.normal(1.0, 0.1)
        market_trend = 1.0 + (days_ahead * 0.001)  # Slight upward trend
        government_subsidy = np.random.choice([0, 1], p=[0.7, 0.3])
        
        # Prepare features
        features = np.array([[
            seasonal_factor,
            demand_factor,
            supply_factor,
            weather_factor,
            market_trend,
            government_subsidy
        ]])
        
        # Scale features
        features_scaled = scalers[millet_type].transform(features)
        
        # Make prediction
        predicted_price = models[millet_type].predict(features_scaled)[0]
        
        # Get confidence interval
        predictions = []
        for _ in range(100):
            # Add some randomness for confidence interval
            noise = np.random.normal(0, 0.05, features.shape)
            features_noisy = features_scaled + noise
            pred = models[millet_type].predict(features_noisy)[0]
            predictions.append(pred)
        
        confidence_lower = np.percentile(predictions, 25)
        confidence_upper = np.percentile(predictions, 75)
        
        return jsonify({
            'millet_type': millet_type,
            'predicted_price': round(predicted_price, 2),
            'confidence_lower': round(confidence_lower, 2),
            'confidence_upper': round(confidence_upper, 2),
            'prediction_date': future_date.strftime('%Y-%m-%d'),
            'factors': {
                'seasonal_factor': round(seasonal_factor, 3),
                'demand_factor': round(demand_factor, 3),
                'supply_factor': round(supply_factor, 3),
                'weather_factor': round(weather_factor, 3),
                'market_trend': round(market_trend, 3),
                'government_subsidy': government_subsidy
            },
            'location': {
                'state': state,
                'district': district
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/price-trend', methods=['POST'])
def get_price_trend():
    """Get price trend for a millet type"""
    try:
        data = request.get_json()
        millet_type = data.get('millet_type')
        days = data.get('days', 30)
        
        if not millet_type:
            return jsonify({'error': 'Millet type is required'}), 400
        
        if millet_type not in price_data:
            return jsonify({'error': f'Data not available for {millet_type}'}), 400
        
        # Get recent data
        df = price_data[millet_type].tail(days)
        
        trend_data = []
        for _, row in df.iterrows():
            trend_data.append({
                'date': row['date'].strftime('%Y-%m-%d'),
                'price': round(row['price'], 2),
                'demand_factor': round(row['demand_factor'], 3),
                'supply_factor': round(row['supply_factor'], 3)
            })
        
        # Calculate trend direction
        recent_prices = [item['price'] for item in trend_data[-7:]]
        if len(recent_prices) >= 2:
            trend_direction = 'up' if recent_prices[-1] > recent_prices[0] else 'down'
        else:
            trend_direction = 'stable'
        
        return jsonify({
            'millet_type': millet_type,
            'trend_direction': trend_direction,
            'current_price': trend_data[-1]['price'] if trend_data else 0,
            'price_change_percent': round(
                ((recent_prices[-1] - recent_prices[0]) / recent_prices[0]) * 100, 2
            ) if len(recent_prices) >= 2 else 0,
            'data': trend_data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/market-insights', methods=['POST'])
def get_market_insights():
    """Get comprehensive market insights"""
    try:
        data = request.get_json()
        state = data.get('state', 'Bihar')
        
        insights = {
            'best_selling_millets': [],
            'price_recommendations': {},
            'market_conditions': {},
            'seasonal_advice': {}
        }
        
        # Analyze each millet type
        for millet_type in models.keys():
            # Get current trend
            trend_response = get_price_trend()
            trend_data = trend_response.get_json()
            
            if trend_data and 'current_price' in trend_data:
                current_price = trend_data['current_price']
                
                # Calculate recommended selling price (5% markup)
                recommended_price = current_price * 1.05
                
                insights['price_recommendations'][millet_type] = {
                    'current_market_price': round(current_price, 2),
                    'recommended_selling_price': round(recommended_price, 2),
                    'profit_margin': round(recommended_price - current_price, 2)
                }
                
                # Add to best selling list
                insights['best_selling_millets'].append({
                    'millet_type': millet_type,
                    'current_price': round(current_price, 2),
                    'profit_potential': round(recommended_price - current_price, 2)
                })
        
        # Sort by profit potential
        insights['best_selling_millets'].sort(key=lambda x: x['profit_potential'], reverse=True)
        
        # Market conditions
        insights['market_conditions'] = {
            'demand_level': 'High',
            'supply_level': 'Moderate',
            'market_trend': 'Bullish',
            'recommended_action': 'Consider selling now for better profits'
        }
        
        # Seasonal advice
        current_month = datetime.now().month
        if current_month in [10, 11, 12, 1]:  # Harvest season
            insights['seasonal_advice'] = {
                'season': 'Harvest Season',
                'advice': 'Best time to sell fresh harvest. Prices are typically higher.',
                'recommendation': 'List your products now for maximum profit'
            }
        elif current_month in [6, 7, 8, 9]:  # Monsoon season
            insights['seasonal_advice'] = {
                'season': 'Monsoon Season',
                'advice': 'Storage and quality are crucial. Consider processing options.',
                'recommendation': 'Focus on quality preservation and storage'
            }
        else:
            insights['seasonal_advice'] = {
                'season': 'Off Season',
                'advice': 'Limited fresh supply. Processed products may have better demand.',
                'recommendation': 'Consider value-added products'
            }
        
        return jsonify(insights)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': len(models),
        'millet_types': list(models.keys()),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Initializing AI Price Prediction Service...")
    initialize_models()
    print("Models initialized successfully!")
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
