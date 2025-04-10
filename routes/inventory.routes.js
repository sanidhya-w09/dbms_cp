const db = require('../models');
const Inventory = db.inventory;
const Product = db.product;

// Middleware for checking if user is logged in as seller
const isSeller = (req, res, next) => {
  if (req.session.user && req.session.userType === 'seller') {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = app => {
  // Get all inventory items for a seller
  app.get('/seller/inventory', isSeller, async (req, res) => {
    try {
      const inventory = await Inventory.findAll({
        where: {
          sid: req.session.user.id
        },
        include: [{ model: Product }]
      });
      
      res.render('inventory', {
        title: 'My Inventory',
        inventory: inventory,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching inventory');
    }
  });

  // Add to inventory form
  app.get('/seller/inventory/add', isSeller, async (req, res) => {
    try {
      // Get all products to select from
      const products = await Product.findAll();
      
      res.render('add-inventory', {
        title: 'Add to Inventory',
        products: products,
        user: req.session.user,
        error: null
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading add inventory form');
    }
  });

  // Add existing product to inventory
  app.post('/seller/inventory/add', isSeller, async (req, res) => {
    try {
      const { pid, quantity } = req.body;
      
      // Check if product exists
      const product = await Product.findByPk(pid);
      
      if (!product) {
        const products = await Product.findAll();
        return res.render('add-inventory', {
          title: 'Add to Inventory',
          products: products,
          user: req.session.user,
          error: 'Product does not exist'
        });
      }
      
      // Check if item already in inventory
      let inventory = await Inventory.findOne({
        where: {
          pid: pid,
          sid: req.session.user.id
        }
      });
      
      if (inventory) {
        // Update quantity if already exists
        await Inventory.update(
          { quantity: inventory.quantity + parseInt(quantity) },
          {
            where: {
              pid: pid,
              sid: req.session.user.id
            }
          }
        );
      } else {
        // Create new inventory entry
        await Inventory.create({
          pid: pid,
          pname: product.pname,
          quantity: quantity,
          sid: req.session.user.id
        });
      }
      
      res.redirect('/seller/inventory');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding to inventory');
    }
  });

  // Update inventory form
  app.get('/seller/inventory/update/:pid', isSeller, async (req, res) => {
    try {
      const pid = req.params.pid;
      
      // Get inventory item
      const inventory = await Inventory.findOne({
        where: {
          pid: pid,
          sid: req.session.user.id
        },
        include: [{ model: Product }]
      });
      
      if (!inventory) {
        return res.redirect('/seller/inventory');
      }
      
      res.render('update-inventory', {
        title: 'Update Inventory',
        inventory: inventory,
        user: req.session.user,
        error: null
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading update inventory form');
    }
  });
};