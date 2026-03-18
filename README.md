# SN Jewellers — Luxury E-Commerce Website

A premium, full-stack jewellery e-commerce website built with React and Node.js.

## Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v18 or higher) — Download from [https://nodejs.org](https://nodejs.org)
2. **MongoDB** — Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env` file with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sn_jewellers
JWT_SECRET=sn_jewellers_secret_key_2024_luxury
JWT_EXPIRE=7d
NODE_ENV=development
```

If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **Admin account**: `admin@snjewellers.com` / `admin123456`
- **12 sample products** (gold & silver jewellery)

### 4. Run the Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Project Structure

```
SN/
├── client/                        # React Frontend (Vite)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── layout/            # Header, Footer
│   │   │   ├── ui/                # Toast notifications
│   │   │   └── product/           # Product card
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Products.jsx       # Product listing + filters
│   │   │   ├── ProductDetail.jsx  # Single product view
│   │   │   ├── About.jsx          # About page
│   │   │   ├── Contact.jsx        # Contact page + form
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── Signup.jsx         # User registration
│   │   │   └── admin/             # Admin pages
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageProducts.jsx
│   │   │       └── ManageEnquiries.jsx
│   │   ├── context/               # Auth context (React Context API)
│   │   ├── services/              # API service layer (Axios)
│   │   ├── hooks/                 # Custom hooks (useToast)
│   │   ├── utils/                 # Helpers (formatPrice, etc.)
│   │   ├── App.jsx                # Root component + routing
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Complete design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                        # Express Backend
│   ├── config/db.js               # MongoDB connection
│   ├── controllers/               # Route handlers
│   │   ├── authController.js      # Auth (signup/login/admin)
│   │   ├── productController.js   # Product CRUD + stats
│   │   └── enquiryController.js   # Enquiry management
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── upload.js              # Multer image upload
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Enquiry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── enquiries.js
│   ├── uploads/                   # Uploaded product images
│   ├── seed.js                    # Database seeder
│   ├── server.js                  # Express entry point
│   ├── .env                       # Environment variables
│   └── package.json
└── README.md
```

## Features

### Public Website
- **Home**: Hero section, featured products, category cards, trust signals
- **Gold/Silver Collections**: Filterable product listing with pagination
- **Product Detail**: Image gallery, specs, enquiry form
- **About Us**: Brand story, founder section, company values
- **Contact**: Store info, Google Maps, contact form

### Authentication
- User signup/login with JWT tokens
- Separate admin login with role-based access
- Protected admin routes and API endpoints

### Admin Dashboard
- **Dashboard**: Stats overview (products, enquiries)
- **Product Management**: Full CRUD with image upload
- **Enquiry Management**: View, status updates, delete

### Design
- **Color Palette**: Gold (#C5A04E), Cream (#FAF7F2), Charcoal (#2C2C2C)
- **Typography**: Playfair Display (headings), Inter (body), Cormorant Garamond (accents)
- **Micro-interactions**: Hover effects, smooth transitions, scroll effects
- **Responsive**: Full mobile + desktop support

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/signup | Register user | — |
| POST | /api/auth/login | User login | — |
| POST | /api/auth/admin/login | Admin login | — |
| GET | /api/auth/me | Get current user | JWT |
| GET | /api/products | List products | — |
| GET | /api/products/:id | Get product | — |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| GET | /api/products/stats | Product stats | Admin |
| POST | /api/enquiries | Submit enquiry | — |
| GET | /api/enquiries | List enquiries | Admin |
| PUT | /api/enquiries/:id | Update status | Admin |
| DELETE | /api/enquiries/:id | Delete enquiry | Admin |
| GET | /api/enquiries/stats | Enquiry stats | Admin |

## Deployment

### Build for Production

```bash
cd client
npm run build
```

Set `NODE_ENV=production` in server `.env` and the Express server will serve the built frontend.

## License

&copy; 2024 SN Jewellers. All rights reserved.
