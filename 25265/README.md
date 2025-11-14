# Millets Value Chain Platform

A comprehensive digital marketplace connecting farmers, buyers, processors, and consumers in the millet ecosystem. This platform promotes "Shree Anna" - the super grain of India, with complete traceability, quality certification, and secure trading.

## 🌟 Features

### Core Features
- **Multi-User Platform**: Support for 5 user types (Farmer, Buyer/Processor, Consumer, Admin, Logistics)
- **Digital Marketplace**: Buy and sell millet products with real-time pricing
- **End-to-End Traceability**: Track products from farm to fork with blockchain-like transparency
- **Quality Certification**: Organic certification and quality grading system
- **Government Schemes**: Integration with government schemes and subsidies
- **Regional Language Support**: Multilingual interface for rural accessibility

### Advanced Features
- **AI-Powered Market Insights**: Dynamic pricing and demand predictions
- **Digital Wallet Integration**: Secure payments with UPI support
- **IoT Quality Monitoring**: Real-time quality assessment
- **Logistics Tracking**: Complete supply chain visibility
- **Data Analytics Dashboard**: Insights for all stakeholders

## 🏗️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **Authentication**: JWT-based authentication
- **API**: RESTful APIs with comprehensive endpoints

### Frontend
- **Framework**: React.js
- **UI Library**: Bootstrap 5 with custom styling
- **State Management**: React Context API
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome

### Additional Tools
- **Payment Gateway**: Ready for integration with Razorpay/PayU
- **File Upload**: Secure file handling for product images
- **Email**: SMTP integration for notifications
- **Logging**: Comprehensive error logging and monitoring

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React application**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🔑 Demo Accounts

The platform comes with pre-configured demo accounts for testing:

| User Type | Email | Password | Description |
|-----------|-------|----------|-------------|
| **Farmer** | farmer@example.com | farmer123 | Can add products, manage orders |
| **Buyer** | buyer@example.com | buyer123 | Can browse products, place orders |
| **Admin** | admin@milletsplatform.com | admin123 | Full platform access |
| **Consumer** | consumer@example.com | consumer123 | Can purchase products |

## 📱 User Roles & Features

### 👨‍🌾 Farmers
- Add and manage millet products
- Set pricing and quality specifications
- Track orders and payments
- Access government schemes
- View market prices and trends

### 🏭 Buyers/Processors
- Browse and search products
- Place bulk orders
- Access quality certificates
- Track supply chain
- Manage procurement

### 🛒 Consumers
- Shop for millet products
- View product traceability
- Access nutritional information
- Place orders with secure payments

### 👨‍💼 Administrators
- Manage user accounts
- Monitor platform activity
- Handle disputes and support
- Generate analytics reports
- Manage government schemes

### 🚚 Logistics Providers
- Track shipments
- Update delivery status
- Manage transportation routes
- Coordinate with stakeholders

## 🗄️ Database Schema

### Core Tables
- **Users**: User profiles and authentication
- **MilletProducts**: Product listings with specifications
- **Orders**: Order management and tracking
- **TraceabilityRecords**: Supply chain tracking
- **Payments**: Payment processing and history
- **GovernmentSchemes**: Scheme information and eligibility
- **MarketPrices**: Real-time pricing data

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Add new product (farmers only)
- `GET /api/products/{id}` - Get product details

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order status

### Traceability
- `GET /api/traceability/{product_id}` - Get product traceability

### Market Data
- `GET /api/market-prices` - Get market prices
- `GET /api/schemes` - Get government schemes

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**
   ```bash
   # Install production dependencies
   pip install gunicorn
   
   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend Deployment**
   ```bash
   # Build for production
   npm run build
   
   # Serve with a web server like Nginx
   ```

### Environment Variables

Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///millets_platform.db
UPLOAD_FOLDER=uploads
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Secure file upload handling
- SQL injection prevention

## 📊 Analytics & Reporting

The platform provides comprehensive analytics for:
- Sales trends and patterns
- User engagement metrics
- Product performance data
- Market price analysis
- Supply chain insights

## 🌐 Multi-language Support

Ready for regional language integration:
- English (default)
- Hindi
- Tamil
- Telugu
- Bengali
- Gujarati
- Marathi

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and queries:
- Email: support@milletsplatform.com
- Phone: +91-9876543210
- Documentation: [Platform Documentation](link-to-docs)

## 🎯 Future Enhancements

- Mobile app development
- AI-powered crop recommendations
- Weather integration for farmers
- Blockchain implementation for full traceability
- Advanced analytics and machine learning
- Integration with government databases
- Multi-currency support
- Advanced logistics optimization

---

**Built with ❤️ for the Millets Community**

*Promoting "Shree Anna" - The Super Grain of India*
