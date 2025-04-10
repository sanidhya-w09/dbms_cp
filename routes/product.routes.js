const db = require('../models');
const Product = db.product;
const Inventory = db.inventory;

module.exports = app => {
  // List all products (with stock > 0)
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{
          model: Inventory,
          where: {
            quantity: {
              [db.Sequelize.Op.gt]: 0
            }
          }
        }]
      });
      
      res.render('products', {
        title: 'All Products',
        products: products,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching products');
    }
  });

  // Get product details
  app.get('/products/:pid', async (req, res) => {
    try {
      const pid = req.params.pid;
      
      const product = await Product.findByPk(pid, {
        include: [{
          model: Inventory,
          where: {
            quantity: {
              [db.Sequelize.Op.gt]: 0
            }
          }
        }]
      });
      
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      res.render('product-details', {
        title: product.pname,
        product: product,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching product details');
    }
  });

  // Search products by name
  app.get('/search', async (req, res) => {
    try {
      const searchTerm = req.query.term;
      
      if (!searchTerm) {
        return res.redirect('/products');
      }
      
      const products = await Product.findAll({
        where: {
          pname: {
            [db.Sequelize.Op.like]: `%${searchTerm}%`
          }
        },
        include: [{
          model: Inventory,
          where: {
            quantity: {
              [db.Sequelize.Op.gt]: 0
            }
          }
        }]
      });
      
      res.render('search-results', {
        title: 'Search Results',
        products: products,
        searchTerm: searchTerm,
        user: req.session.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error searching products');
    }
  });
};