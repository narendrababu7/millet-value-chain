from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta
import jwt
import os
from werkzeug.utils import secure_filename
import uuid
import requests
import hashlib
import razorpay

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///millets_platform.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

# Initialize Razorpay
client = razorpay.Client(auth=("rzp_test_1234567890", "test_key_1234567890"))  # Replace with actual keys

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # farmer, buyer, consumer, admin, logistics
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    address = db.Column(db.Text, nullable=False)
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Additional fields for farmers
    farm_size = db.Column(db.Float, nullable=True)
    millet_types = db.Column(db.Text, nullable=True)  # JSON string
    
    # Additional fields for buyers/processors
    business_type = db.Column(db.String(50), nullable=True)
    license_number = db.Column(db.String(100), nullable=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class MilletProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # Pearl, Finger, Foxtail, etc.
    variety = db.Column(db.String(50), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  # kg, quintal, ton
    price_per_unit = db.Column(db.Float, nullable=False)
    harvest_date = db.Column(db.Date, nullable=False)
    quality_grade = db.Column(db.String(10), nullable=False)  # A, B, C
    organic_certified = db.Column(db.Boolean, default=False)
    moisture_content = db.Column(db.Float, nullable=True)
    protein_content = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=True)
    images = db.Column(db.Text, nullable=True)  # JSON string of image paths
    status = db.Column(db.String(20), default='available')  # available, sold, processing
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    farmer = db.relationship('User', backref=db.backref('products', lazy=True))

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('millet_product.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, shipped, delivered, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, refunded
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    delivery_date = db.Column(db.DateTime, nullable=True)
    delivery_address = db.Column(db.Text, nullable=False)
    tracking_number = db.Column(db.String(50), nullable=True)
    
    buyer = db.relationship('User', foreign_keys=[buyer_id], backref=db.backref('orders_as_buyer', lazy=True))
    seller = db.relationship('User', foreign_keys=[seller_id], backref=db.backref('orders_as_seller', lazy=True))
    product = db.relationship('MilletProduct', backref=db.backref('orders', lazy=True))

class TraceabilityRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('millet_product.id'), nullable=False)
    stage = db.Column(db.String(50), nullable=False)  # planting, harvesting, processing, packaging, shipping
    location = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    operator = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    certificate_url = db.Column(db.String(200), nullable=True)
    blockchain_hash = db.Column(db.String(100), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    product = db.relationship('MilletProduct', backref=db.backref('traceability_records', lazy=True))

class BlockchainBatch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.String(50), unique=True, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('millet_product.id'), nullable=False)
    transaction_hash = db.Column(db.String(100), nullable=True)
    block_number = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('MilletProduct', backref=db.backref('blockchain_batches', lazy=True))

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # UPI, bank_transfer, digital_wallet
    transaction_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed, refunded
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    order = db.relationship('Order', backref=db.backref('payments', lazy=True))

class GovernmentScheme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    eligibility_criteria = db.Column(db.Text, nullable=False)
    benefits = db.Column(db.Text, nullable=False)
    application_process = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.Date, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MarketPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    millet_type = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    price_per_kg = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    source = db.Column(db.String(100), nullable=False)  # mandi, government, platform

# Authentication decorator
def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        full_name=data['full_name'],
        phone=data['phone'],
        address=data['address'],
        state=data['state'],
        district=data['district'],
        user_type=data['user_type'],
        farm_size=data.get('farm_size'),
        millet_types=data.get('millet_types'),
        business_type=data.get('business_type'),
        license_number=data.get('license_number')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'full_name': user.full_name,
                'is_verified': user.is_verified
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'user_type': current_user.user_type,
        'full_name': current_user.full_name,
        'phone': current_user.phone,
        'address': current_user.address,
        'state': current_user.state,
        'district': current_user.district,
        'farm_size': current_user.farm_size,
        'millet_types': current_user.millet_types,
        'business_type': current_user.business_type,
        'license_number': current_user.license_number,
        'is_verified': current_user.is_verified
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    products = MilletProduct.query.filter_by(status='available').all()
    result = []
    
    for product in products:
        result.append({
            'id': product.id,
            'name': product.name,
            'type': product.type,
            'variety': product.variety,
            'farmer_name': product.farmer.full_name,
            'quantity': product.quantity,
            'unit': product.unit,
            'price_per_unit': product.price_per_unit,
            'harvest_date': product.harvest_date.isoformat(),
            'quality_grade': product.quality_grade,
            'organic_certified': product.organic_certified,
            'description': product.description,
            'created_at': product.created_at.isoformat()
        })
    
    return jsonify(result)

@app.route('/api/products', methods=['POST'])
@token_required
def add_product(current_user):
    if current_user.user_type != 'farmer':
        return jsonify({'message': 'Only farmers can add products!'}), 403
    
    data = request.get_json()
    
    product = MilletProduct(
        name=data['name'],
        type=data['type'],
        variety=data['variety'],
        farmer_id=current_user.id,
        quantity=data['quantity'],
        unit=data['unit'],
        price_per_unit=data['price_per_unit'],
        harvest_date=datetime.strptime(data['harvest_date'], '%Y-%m-%d').date(),
        quality_grade=data['quality_grade'],
        organic_certified=data.get('organic_certified', False),
        moisture_content=data.get('moisture_content'),
        protein_content=data.get('protein_content'),
        description=data.get('description')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({'message': 'Product added successfully!'}), 201

@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    product = MilletProduct.query.get(data['product_id'])
    
    if not product:
        return jsonify({'message': 'Product not found!'}), 404
    
    if product.quantity < data['quantity']:
        return jsonify({'message': 'Insufficient quantity available!'}), 400
    
    order_number = f"ORD{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:8].upper()}"
    
    order = Order(
        order_number=order_number,
        buyer_id=current_user.id,
        seller_id=product.farmer_id,
        product_id=product.id,
        quantity=data['quantity'],
        total_amount=data['quantity'] * product.price_per_unit,
        delivery_address=data['delivery_address']
    )
    
    # Update product quantity
    product.quantity -= data['quantity']
    if product.quantity <= 0:
        product.status = 'sold'
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({'message': 'Order created successfully!', 'order_number': order_number}), 201

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    if current_user.user_type == 'farmer':
        orders = Order.query.filter_by(seller_id=current_user.id).all()
    elif current_user.user_type in ['buyer', 'consumer']:
        orders = Order.query.filter_by(buyer_id=current_user.id).all()
    else:
        orders = Order.query.all()
    
    result = []
    for order in orders:
        result.append({
            'id': order.id,
            'order_number': order.order_number,
            'product_name': order.product.name,
            'quantity': order.quantity,
            'total_amount': order.total_amount,
            'status': order.status,
            'payment_status': order.payment_status,
            'order_date': order.order_date.isoformat(),
            'delivery_date': order.delivery_date.isoformat() if order.delivery_date else None,
            'buyer_name': order.buyer.full_name,
            'seller_name': order.seller.full_name
        })
    
    return jsonify(result)

@app.route('/api/traceability/<int:product_id>', methods=['GET'])
def get_traceability(product_id):
    records = TraceabilityRecord.query.filter_by(product_id=product_id).order_by(TraceabilityRecord.timestamp).all()
    
    result = []
    for record in records:
        result.append({
            'stage': record.stage,
            'location': record.location,
            'timestamp': record.timestamp.isoformat(),
            'operator': record.operator,
            'notes': record.notes,
            'certificate_url': record.certificate_url
        })
    
    return jsonify(result)

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    schemes = GovernmentScheme.query.filter_by(is_active=True).all()
    result = []
    
    for scheme in schemes:
        result.append({
            'id': scheme.id,
            'title': scheme.title,
            'description': scheme.description,
            'eligibility_criteria': scheme.eligibility_criteria,
            'benefits': scheme.benefits,
            'application_process': scheme.application_process,
            'deadline': scheme.deadline.isoformat() if scheme.deadline else None,
            'created_at': scheme.created_at.isoformat()
        })
    
    return jsonify(result)

@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    state = request.args.get('state')
    district = request.args.get('district')
    
    query = MarketPrice.query
    if state:
        query = query.filter_by(state=state)
    if district:
        query = query.filter_by(district=district)
    
    prices = query.order_by(MarketPrice.date.desc()).limit(50).all()
    result = []
    
    for price in prices:
        result.append({
            'millet_type': price.millet_type,
            'state': price.state,
            'district': price.district,
            'price_per_kg': price.price_per_kg,
            'date': price.date.isoformat(),
            'source': price.source
        })
    
    return jsonify(result)

@app.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    stats = {}
    
    if current_user.user_type == 'farmer':
        stats['total_products'] = MilletProduct.query.filter_by(farmer_id=current_user.id).count()
        stats['active_listings'] = MilletProduct.query.filter_by(farmer_id=current_user.id, status='available').count()
        stats['total_orders'] = Order.query.filter_by(seller_id=current_user.id).count()
        stats['total_revenue'] = db.session.query(db.func.sum(Order.total_amount)).filter_by(
            seller_id=current_user.id, 
            payment_status='paid'
        ).scalar() or 0
    
    elif current_user.user_type in ['buyer', 'consumer']:
        stats['total_orders'] = Order.query.filter_by(buyer_id=current_user.id).count()
        stats['pending_orders'] = Order.query.filter_by(buyer_id=current_user.id, status='pending').count()
        stats['total_spent'] = db.session.query(db.func.sum(Order.total_amount)).filter_by(
            buyer_id=current_user.id, 
            payment_status='paid'
        ).scalar() or 0
    
    elif current_user.user_type == 'admin':
        stats['total_users'] = User.query.count()
        stats['total_products'] = MilletProduct.query.count()
        stats['total_orders'] = Order.query.count()
        stats['total_revenue'] = db.session.query(db.func.sum(Order.total_amount)).filter_by(
            payment_status='paid'
        ).scalar() or 0
    
    return jsonify(stats)

# Blockchain Integration Routes
@app.route('/api/blockchain/create-batch', methods=['POST'])
@token_required
def create_blockchain_batch(current_user):
    data = request.get_json()
    product_id = data.get('product_id')
    
    product = MilletProduct.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found!'}), 404
    
    # Generate batch ID
    batch_id = f"BATCH_{product_id}_{int(datetime.now().timestamp())}"
    
    # Simulate blockchain transaction (in real implementation, call blockchain service)
    transaction_hash = hashlib.sha256(f"{batch_id}_{datetime.now()}".encode()).hexdigest()[:20]
    block_number = 12345  # Simulated block number
    
    # Create blockchain batch record
    blockchain_batch = BlockchainBatch(
        batch_id=batch_id,
        product_id=product_id,
        transaction_hash=transaction_hash,
        block_number=block_number
    )
    
    db.session.add(blockchain_batch)
    db.session.commit()
    
    return jsonify({
        'message': 'Blockchain batch created successfully!',
        'batch_id': batch_id,
        'transaction_hash': transaction_hash,
        'block_number': block_number
    })

@app.route('/api/blockchain/add-trace', methods=['POST'])
@token_required
def add_blockchain_trace(current_user):
    data = request.get_json()
    
    # Create traceability record
    record = TraceabilityRecord(
        product_id=data['product_id'],
        stage=data['stage'],
        location=data['location'],
        operator=data['operator'],
        notes=data.get('notes'),
        certificate_url=data.get('certificate_url'),
        blockchain_hash=hashlib.sha256(f"{data['product_id']}_{data['stage']}_{datetime.now()}".encode()).hexdigest()[:20],
        is_verified=True
    )
    
    db.session.add(record)
    db.session.commit()
    
    return jsonify({'message': 'Traceability record added to blockchain!'})

# AI Service Integration Routes
@app.route('/api/ai/predict-price', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()
        
        # Call AI service
        ai_service_url = 'http://localhost:5001/predict-price'
        response = requests.post(ai_service_url, json=data, timeout=10)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'AI service unavailable'}), 503
            
    except requests.exceptions.RequestException:
        # Fallback prediction without AI service
        millet_type = data.get('millet_type', 'Pearl Millet')
        base_prices = {
            'Pearl Millet': 45,
            'Finger Millet': 65,
            'Foxtail Millet': 55,
            'Little Millet': 50,
            'Proso Millet': 48
        }
        
        predicted_price = base_prices.get(millet_type, 45)
        
        return jsonify({
            'millet_type': millet_type,
            'predicted_price': predicted_price,
            'confidence_lower': predicted_price * 0.9,
            'confidence_upper': predicted_price * 1.1,
            'prediction_date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'fallback_prediction': True
        })

@app.route('/api/ai/market-insights', methods=['POST'])
def get_market_insights():
    try:
        data = request.get_json()
        
        # Call AI service
        ai_service_url = 'http://localhost:5001/market-insights'
        response = requests.post(ai_service_url, json=data, timeout=10)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'AI service unavailable'}), 503
            
    except requests.exceptions.RequestException:
        # Fallback insights
        return jsonify({
            'best_selling_millets': [
                {'millet_type': 'Pearl Millet', 'current_price': 45, 'profit_potential': 5},
                {'millet_type': 'Finger Millet', 'current_price': 65, 'profit_potential': 8}
            ],
            'market_conditions': {
                'demand_level': 'High',
                'supply_level': 'Moderate',
                'market_trend': 'Bullish',
                'recommendation': 'Consider selling now'
            },
            'fallback_insights': True
        })

# Payment Gateway Integration Routes
@app.route('/api/payment/create-order', methods=['POST'])
@token_required
def create_payment_order(current_user):
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Create Razorpay order
        amount = int(order.total_amount * 100)  # Convert to paise
        
        razorpay_order = client.order.create({
            'amount': amount,
            'currency': 'INR',
            'receipt': f'order_{order_id}',
            'notes': {
                'order_id': order_id,
                'customer_name': current_user.full_name,
                'product': order.product.name
            }
        })
        
        return jsonify({
            'razorpay_order_id': razorpay_order['id'],
            'amount': amount,
            'currency': 'INR',
            'order_id': order_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/verify', methods=['POST'])
@token_required
def verify_payment(current_user):
    try:
        data = request.get_json()
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        order_id = data.get('order_id')
        
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id
        }
        
        client.utility.verify_payment_signature(params_dict, razorpay_signature)
        
        # Update order payment status
        order = Order.query.get(order_id)
        if order:
            order.payment_status = 'paid'
            
            # Create payment record
            payment = Payment(
                order_id=order_id,
                amount=order.total_amount,
                payment_method='razorpay',
                transaction_id=razorpay_payment_id,
                status='completed'
            )
            
            db.session.add(payment)
            db.session.commit()
        
        return jsonify({'message': 'Payment verified successfully!'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# File Upload Routes
@app.route('/api/upload/image', methods=['POST'])
@token_required
def upload_image(current_user):
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename = f"{uuid.uuid4()}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            return jsonify({
                'message': 'Image uploaded successfully!',
                'filename': filename,
                'filepath': f'/uploads/{filename}'
            })
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create sample data
        if User.query.count() == 0:
            # Create admin user
            admin = User(
                username='admin',
                email='admin@milletsplatform.com',
                full_name='System Administrator',
                phone='9999999999',
                address='System Office',
                state='Delhi',
                district='New Delhi',
                user_type='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            
            # Create sample farmer
            farmer = User(
                username='farmer1',
                email='farmer@example.com',
                full_name='Rajesh Kumar',
                phone='9876543210',
                address='Village: Ramgarh, Block: Chakia',
                state='Bihar',
                district='Muzaffarpur',
                user_type='farmer',
                farm_size=5.0,
                millet_types='["Pearl Millet", "Finger Millet"]',
                is_verified=True
            )
            farmer.set_password('farmer123')
            db.session.add(farmer)
            
            # Create sample buyer
            buyer = User(
                username='buyer1',
                email='buyer@example.com',
                full_name='Agro Processors Ltd',
                phone='9876543211',
                address='Industrial Area, Sector 5',
                state='Haryana',
                district='Gurgaon',
                user_type='buyer',
                business_type='Food Processor',
                license_number='FSSAI123456789'
            )
            buyer.set_password('buyer123')
            db.session.add(buyer)
            
            db.session.commit()
            
            # Create sample products
            product1 = MilletProduct(
                name='Premium Pearl Millet',
                type='Pearl Millet',
                variety='HHB 67',
                farmer_id=farmer.id,
                quantity=100.0,
                unit='kg',
                price_per_unit=45.0,
                harvest_date=datetime.now().date(),
                quality_grade='A',
                organic_certified=True,
                moisture_content=12.5,
                protein_content=11.2,
                description='High quality organic pearl millet with excellent nutritional value'
            )
            db.session.add(product1)
            
            # Create sample market prices
            price1 = MarketPrice(
                millet_type='Pearl Millet',
                state='Bihar',
                district='Muzaffarpur',
                price_per_kg=42.0,
                date=datetime.now().date(),
                source='Government Mandi'
            )
            db.session.add(price1)
            
            # Create sample government scheme
            scheme1 = GovernmentScheme(
                title='National Millet Mission',
                description='Promoting millet cultivation and consumption across India',
                eligibility_criteria='All farmers cultivating millets',
                benefits='Subsidy on seeds, fertilizers, and equipment',
                application_process='Apply through local agriculture department',
                deadline=datetime.now().date() + timedelta(days=30)
            )
            db.session.add(scheme1)
            
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
