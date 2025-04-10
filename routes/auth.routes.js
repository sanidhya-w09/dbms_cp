const bcrypt = require('bcrypt');
const db = require('../models');
const Customer = db.customer;
const Seller = db.seller;

module.exports = app => {
  // Login page
  app.get('/login', (req, res) => {
    if (req.session.user) {
      // If user already logged in, redirect to homepage
      return res.redirect(req.session.userType === 'customer' ? '/homepage' : '/seller/homepage');
    }
    res.render('login', { title: 'Login', error: null });
  });

  // Register page for customer
  app.get('/register', (req, res) => {
    if (req.session.user) {
      return res.redirect('/homepage');
    }
    res.render('register', { title: 'Register', error: null });
  });

  // Register page for seller
  app.get('/seller/register', (req, res) => {
    if (req.session.user) {
      return res.redirect('/seller/homepage');
    }
    res.render('seller-register', { title: 'Seller Registration', error: null });
  });

  // Process customer login
  app.post('/login/customer', async (req, res) => {
    try {
      const { uid, password } = req.body;
      
      // Find customer by uid
      const customer = await Customer.findByPk(uid);
      
      if (!customer) {
        return res.render('login', { 
          title: 'Login', 
          error: 'User ID does not exist' 
        });
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, customer.pass);
      
      if (!isPasswordValid) {
        return res.render('login', { 
          title: 'Login', 
          error: 'Invalid password' 
        });
      }
      
      // Set session
      req.session.user = {
        id: customer.uid,
        name: customer.fname + ' ' + customer.lname
      };
      req.session.userType = 'customer';
      
      res.redirect('/homepage');
    } catch (err) {
      console.error(err);
      res.render('login', { 
        title: 'Login', 
        error: 'An error occurred during login' 
      });
    }
  });

  // Process seller login
  app.post('/login/seller', async (req, res) => {
    try {
      const { sid, password } = req.body;
      
      // Find seller by sid
      const seller = await Seller.findByPk(sid);
      
      if (!seller) {
        return res.render('login', { 
          title: 'Login', 
          error: 'Seller ID does not exist' 
        });
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, seller.pass);
      
      if (!isPasswordValid) {
        return res.render('login', { 
          title: 'Login', 
          error: 'Invalid password' 
        });
      }
      
      // Set session
      req.session.user = {
        id: seller.sid,
        name: seller.sname
      };
      req.session.userType = 'seller';
      
      res.redirect('/seller/homepage');
    } catch (err) {
      console.error(err);
      res.render('login', { 
        title: 'Login', 
        error: 'An error occurred during login' 
      });
    }
  });

  // Process customer registration
  app.post('/register/customer', async (req, res) => {
    try {
      const { uid, password, fname, lname, email, address, phno } = req.body;
      
      // Check if user already exists
      const existingCustomer = await Customer.findByPk(uid);
      
      if (existingCustomer) {
        return res.render('register', { 
          title: 'Register', 
          error: 'User ID already exists' 
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new customer
      await Customer.create({
        uid,
        pass: hashedPassword,
        fname,
        lname,
        email,
        address,
        phno
      });
      
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.render('register', { 
        title: 'Register', 
        error: 'An error occurred during registration' 
      });
    }
  });

  // Process seller registration
  app.post('/register/seller', async (req, res) => {
    try {
      const { sid, sname, password, address, phno } = req.body;
      
      // Check if seller already exists
      const existingSeller = await Seller.findByPk(sid);
      
      if (existingSeller) {
        return res.render('seller-register', { 
          title: 'Seller Registration', 
          error: 'Seller ID already exists' 
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new seller
      await Seller.create({
        sid,
        sname,
        pass: hashedPassword,
        address,
        phno
      });
      
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.render('seller-register', { 
        title: 'Seller Registration', 
        error: 'An error occurred during registration' 
      });
    }
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });
};