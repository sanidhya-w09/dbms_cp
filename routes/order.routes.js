const db = require('../models');
const Order = db.orders;
const Product = db.product;
const Customer = db.customer;
const Seller = db.seller;

// Middleware for checking if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = app => {
  // View all orders - for admin only in future enhancement
  app.get('/admin/orders', async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: Product },
          { model: Customer },
          { model: Seller }
        ],
        order: [['timestamp', 'DESC']]
      });
      
      res.render('admin-orders', {
        title: 'All Orders',
        orders: orders,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching orders');
    }
  });

  // View single order details
  app.get('/orders/:oid', isLoggedIn, async (req, res) => {
    try {
      const oid = req.params.oid;
      
      // Additional conditions based on user type
      let condition = {};
      
      if (req.session.userType === 'customer') {
        condition.uid = req.session.user.id;
      } else if (req.session.userType === 'seller') {
        condition.sid = req.session.user.id;
      }
      
      // Add oid to condition
      condition.oid = oid;
      
      const order = await Order.findOne({
        where: condition,
        include: [
          { model: Product },
          { model: Customer },
          { model: Seller }
        ]
      });
      
      if (!order) {
        return res.status(404).send('Order not found or you do not have permission to view it');
      }
      
      res.render('order-details', {
        title: `Order #${order.oid}`,
        order: order,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching order details');
    }
  });
};