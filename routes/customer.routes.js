const db = require('../models');
const Product = db.product;
const Inventory = db.inventory;
const Order = db.orders;
const { Op } = db.Sequelize;

// Middleware for checking if user is logged in as customer
const isCustomer = (req, res, next) => {
  if (req.session.user && req.session.userType === 'customer') {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = app => {
  // Customer Homepage
  app.get('/homepage', isCustomer, async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{
          model: Inventory,
          where: {
            quantity: {
              [Op.gt]: 0 // Only show products with stock
            }
          }
        }]
      });

      res.render('homepage', {
        title: 'Customer Homepage',
        user: req.session.user,
        products: products
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading homepage');
    }
  });

  // View Product Details and Purchase form
  app.get('/buy/:pid', isCustomer, async (req, res) => {
    try {
      const pid = req.body.pid || req.params.pid;
      const product = await Product.findByPk(pid, {
        include: [{
          model: Inventory,
          where: {
            quantity: {
              [Op.gt]: 0
            }
          }
        }]
      });

      if (!product) {
        return res.redirect('/homepage');
      }

      res.render('buy', {
        title: 'Buy Product',
        user: req.session.user,
        product: product
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading product details');
    }
  });

  // Process purchase
  app.post('/place-order', isCustomer, async (req, res) => {
    try {
      const { pid, sid, quantity } = req.body;
      
      // Get inventory
      const inventory = await Inventory.findOne({
        where: {
          pid: pid,
          sid: sid
        }
      });
      
      if (!inventory || inventory.quantity < quantity) {
        return res.render('error', {
          title: 'Error',
          message: 'Insufficient stock'
        });
      }

      // Create order
      await Order.create({
        uid: req.session.user.id,
        pid: pid,
        sid: sid,
        quantity: quantity
      });

      // Update inventory
      await Inventory.update(
        { quantity: inventory.quantity - quantity },
        { where: { pid: pid, sid: sid } }
      );

      res.redirect('/orders');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error placing order');
    }
  });

  // View Order History
  app.get('/orders', isCustomer, async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: {
          uid: req.session.user.id
        },
        include: [
          { model: Product },
          { model: db.seller }
        ],
        order: [['timestamp', 'DESC']]
      });

      res.render('orders', {
        title: 'My Orders',
        user: req.session.user,
        orders: orders
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching orders');
    }
  });
};