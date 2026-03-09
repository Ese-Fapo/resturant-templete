# 🍕 Food Ordering Application

A modern, full-stack food ordering platform built with Next.js, featuring real-time order management, user authentication, and an intuitive admin dashboard.

## 🚀 Live Demo

**🌐 [View Live Website](https://resturant-templete.vercel.app/)**

---

## ✨ Features

### Customer Features
- 🛒 **Shopping Cart** - Add, remove, and manage items
- 👤 **User Authentication** - Secure login and registration with NextAuth
- 📝 **Order Management** - Track order history and status
- 💳 **Checkout Process** - Streamlined ordering experience
- 🎉 **Order Confirmation** - Animated confirmation with confetti effects
- 👨‍💼 **User Profiles** - Manage personal information and addresses
- 🔐 **Password Reset** - Secure password recovery system

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive order and user management
- 🍔 **Menu Management** - Add, edit, and delete menu items
- 📂 **Category Management** - Organize menu by categories
- 👥 **User Management** - View and manage customer accounts
- 📋 **Audit Logs** - Track admin actions and changes
- 🔧 **Admin Login** - Separate admin authentication portal

### Technical Features
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js App Router
- 🎨 **Responsive Design** - Works seamlessly on all devices
- 🖼️ **Image Optimization** - Cloudinary integration for image management
- 🔒 **Secure API Routes** - Protected endpoints with authentication
- 🗄️ **MongoDB Database** - Scalable data storage with Mongoose
- 🧪 **Testing** - Jest and React Testing Library integration
- 🚀 **CI/CD Pipeline** - Automated deployment with GitHub Actions

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js 4
- **Image Management:** Cloudinary
- **Notifications:** React Hot Toast & React Toastify
- **Icons:** React Icons
- **Testing:** Jest & React Testing Library
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local or MongoDB Atlas account)
- **Cloudinary** account (for image uploads)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Email (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📂 Project Structure

```
my-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── cart/            # Cart management
│   │   ├── categories/      # Category CRUD
│   │   ├── menu/            # Menu operations
│   │   ├── orders/          # Order management
│   │   └── profile/         # User profile
│   ├── (marketing)/         # Marketing pages
│   ├── admin-login/         # Admin authentication
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout process
│   ├── dashboard/           # Admin dashboard
│   ├── login/               # User login
│   ├── menu/                # Menu browsing
│   ├── orders/              # Order history
│   ├── profile/             # User profile
│   └── register/            # User registration
├── components/              # Reusable components
│   ├── common/             # Shared components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── features/               # Feature modules
│   ├── auth/              # Authentication logic
│   ├── cart/              # Cart functionality
│   ├── checkout/          # Checkout logic
│   └── food/              # Food-related features
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── mongodb.ts         # MongoDB connection
│   ├── mongoose.ts        # Mongoose setup
│   └── cloudinary/        # Cloudinary config
├── models/                 # Mongoose models
│   ├── user.js            # User model
│   ├── menuItem.js        # Menu item model
│   ├── category.js        # Category model
│   ├── order.js           # Order model
│   └── adminAuditLog.js   # Audit log model
├── services/               # Business logic services
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm test             # Run Jest tests
```

---

## 🔐 Default Admin Access

For initial setup, you may need to manually create an admin user in MongoDB with:
- `role: "admin"`
- Login via: `/admin-login`

---

## 🚀 Deployment

This application is deployed on [Vercel](https://vercel.com) with automatic CI/CD through GitHub Actions.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Requirements:**
1. Set up all environment variables in Vercel dashboard
2. Connect your GitHub repository
3. Configure MongoDB Atlas for production database
4. Set up Cloudinary for image hosting

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

---

## 📱 Features Overview

### Customer Experience
1. Browse menu items by category
2. Add items to cart with quantity selection
3. Secure checkout process
4. Real-time order tracking
5. Profile management
6. Order history

### Admin Experience
1. Dashboard with key metrics
2. Menu item management (CRUD operations)
3. Category organization
4. User management
5. Order processing
6. Audit trail logging

---

## 🔧 Configuration Files

- **`next.config.ts`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript configuration
- **`jest.config.ts`** - Jest testing configuration
- **`vercel.json`** - Vercel deployment settings
- **`lighthouserc.js`** - Lighthouse CI configuration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📧 Support

For questions or support, please open an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ by Your Team**
