# Millets Value Chain Platform - Setup Instructions

## Quick Start Guide

### 1. Backend Setup (Flask)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The backend will start at `http://localhost:5000`

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start at `http://localhost:3000`

## Demo Accounts

Use these accounts to test different user types:

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@example.com | farmer123 |
| Buyer | buyer@example.com | buyer123 |
| Admin | admin@milletsplatform.com | admin123 |
| Consumer | consumer@example.com | consumer123 |

## Features Available

### For Farmers:
- Add millet products to marketplace
- Set pricing and quality specifications
- Track orders from buyers
- View market prices
- Access government schemes

### For Buyers/Processors:
- Browse and search products
- Place orders with secure payments
- Track order status
- View product traceability
- Access quality certificates

### For Consumers:
- Shop for millet products
- View nutritional information
- Track product journey from farm to table
- Secure payment processing

### For Administrators:
- Manage user accounts
- Monitor platform activity
- Handle orders and disputes
- Generate analytics reports

## Key Features Implemented

✅ **Multi-User Authentication System**
✅ **Product Marketplace with Search & Filters**
✅ **Order Management System**
✅ **Traceability Tracking**
✅ **Government Schemes Integration**
✅ **Market Price Dashboard**
✅ **Responsive UI Design**
✅ **Dashboard for Each User Type**
✅ **Profile Management**
✅ **Real-time Data Updates**

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Add new product (farmers only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Traceability
- `GET /api/traceability/{product_id}` - Get product traceability

### Market Data
- `GET /api/market-prices` - Get market prices
- `GET /api/schemes` - Get government schemes

## Troubleshooting

### Common Issues:

1. **Port already in use**
   - Backend: Change port in `app.py` (line 298)
   - Frontend: Use `npm start -- --port 3001`

2. **Database errors**
   - Delete `millets_platform.db` file and restart backend

3. **CORS errors**
   - Ensure backend is running on port 5000
   - Check proxy setting in `package.json`

4. **Authentication issues**
   - Clear browser localStorage
   - Check token in network tab

## File Structure

```
millets-platform/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   └── millets_platform.db   # SQLite database (auto-created)
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Authentication context
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Node.js dependencies
└── README.md               # Project documentation
```

## Next Steps

1. **Test all user flows** using demo accounts
2. **Customize the UI** with your branding
3. **Add more product categories** as needed
4. **Integrate payment gateway** for real transactions
5. **Deploy to production** environment

## Support

For any issues or questions:
- Check the console for error messages
- Review the API responses in network tab
- Ensure all dependencies are installed correctly
- Verify database is created properly

Happy coding! 🚀
