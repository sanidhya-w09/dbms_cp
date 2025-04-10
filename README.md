# Pharmacy Drug Management System

A complete Node.js web application for managing pharmaceutical products, inventory, and orders. This system allows customers to browse and purchase medications while enabling sellers to manage their inventory and track orders.

## Features

- **Customer Features:**
  - User registration and authentication
  - Browse available products
  - Search for specific medications
  - Place orders for medications
  - View order history

- **Seller Features:**
  - Seller registration and authentication
  - Add new pharmaceutical products
  - Manage inventory (update stock quantities)
  - View customer orders

## Technology Stack

- **Backend:** Node.js with Express.js
- **Database:** MySQL with Sequelize ORM
- **Frontend:** EJS templates, Bootstrap, CSS
- **Authentication:** Express Session

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pharmacy-drug-management-system.git
   cd pharmacy-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a MySQL database named `drugdatabase`
   - Import the SQL schema from `../drugdatabase.sql`
   - Configure database connection in `.env` file

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials and other settings

5. Start the application:
   ```
   npm start
   ```

6. Access the application at `http://localhost:3000`

## Database Structure

The system uses the following database tables:
- customer: Stores customer information
- seller: Stores seller/vendor information
- product: Stores product details
- inventory: Tracks product stock levels
- orders: Records customer orders

## Development

For development with automatic server restart:
```
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.