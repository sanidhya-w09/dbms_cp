const db = require('../models');
const Product = db.product;
const Inventory = db.inventory;
const Order = db.orders;
const { Op } = db.Sequelize;

// Middleware for checking if user is logged in as seller
const isSeller = (req, res, next) => {
  if (req.session.user && req.session.userType === 'seller') {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = app => {
  // Seller Homepage
  app.get('/seller/homepage', isSeller, async (req, res) => {
    try {
      // Get all inventory for this seller
      const inventory = await Inventory.findAll({
        where: {
          sid: req.session.user.id
        },
        include: [{ model: Product }]
      });

      res.render('seller-homepage', {
        title: 'Seller Dashboard',
        user: req.session.user,
        inventory: inventory
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading seller homepage');
    }
  });

  // Add Product Form
  app.get('/seller/add-product', isSeller, (req, res) => {
    res.render('add-product', {
      title: 'Add New Product',
      user: req.session.user,
      error: null
    });
  });

  // Process Add Product
  app.post('/seller/add-product', isSeller, async (req, res) => {
    try {
      const { pid, pname, manufacturer, mfg, exp, price, quantity } = req.body;
      
      // Check if product exists
      let product = await Product.findByPk(pid);
      
      if (product) {
        return res.render('add-product', {
          title: 'Add New Product',
          user: req.session.user,
          error: 'Product ID already exists'
        });
      }
      
      // Create new product
      product = await Product.create({
        pid,
        pname,
        manufacturer,
        mfg,
        exp,
        price
      });
      
      // Add to inventory
      await Inventory.create({
        pid,
        pname,
        quantity,
        sid: req.session.user.id
      });
      
      res.redirect('/seller/homepage');
    } catch (err) {
      console.error(err);
      res.render('add-product', {
        title: 'Add New Product',
        user: req.session.user,
        error: 'An error occurred while adding the product'
      });
    }
  });

  // Update Inventory Form
  app.get('/seller/update-inventory/:pid', isSeller, async (req, res) => {
    try {
      const pid = req.params.pid;
      
      // Get inventory item
      const inventory = await Inventory.findOne({
        where: {
          pid,
          sid: req.session.user.id
        },
        include: [{ model: Product }]
      });
      
      if (!inventory) {
        return res.redirect('/seller/homepage');
      }
      
      res.render('update-inventory', {
        title: 'Update Inventory',
        user: req.session.user,
        inventory: inventory,
        error: null
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading update form');
    }
  });

  // Process Update Inventory
  app.post('/seller/update-inventory', isSeller, async (req, res) => {
    try {
      const { pid, quantity } = req.body;
      
      // Update inventory
      await Inventory.update(
        { quantity },
        {
          where: {
            pid,
            sid: req.session.user.id
          }
        }
      );
      
      res.redirect('/seller/homepage');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating inventory');
    }
  });

  // View Orders for Seller
  app.get('/seller/orders', isSeller, async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: {
          sid: req.session.user.id
        },
        include: [
          { model: Product },
          { model: db.customer }
        ],
        order: [['timestamp', 'DESC']]
      });

      res.render('seller-orders', {
        title: 'Customer Orders',
        user: req.session.user,
        orders: orders
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching orders');
    }
  });
};