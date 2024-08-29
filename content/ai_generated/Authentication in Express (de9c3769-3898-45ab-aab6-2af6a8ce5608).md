# Authentication in Express

Authentication is a crucial aspect of web application security, ensuring that
only authorized users can access certain resources.

In Express.js, you can implement authentication using various strategies,
including sessions, JSON Web Tokens (JWT), and third-party authentication
providers. This guide will cover a basic implementation of authentication in an
Express application.

## Setting Up Authentication

1. **Install Dependencies**

   First, install the necessary packages:

   ```bash
   npm install express express-session passport passport-local bcryptjs
   ```

2. **Configure Passport**

   ```js
       Create a passport.js file to configure Passport with a local strategy:

       const passport = require('passport');
       const LocalStrategy = require('passport-local').Strategy;
       const bcrypt = require('bcryptjs');

       passport.use(new LocalStrategy((username, password, done) => {
          // Replace with your user lookup logic
          User.findOne({ username: username }, (err, user) => {
             if (err) return done(err);
             if (!user) return done(null, false);
             bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) return done(null, user);
                else return done(null, false);
             });
          });
       }));

       passport.serializeUser((user, done) => {
          done(null, user.id);
       });

       passport.deserializeUser((id, done) => {
          // Replace with your user lookup logic
          User.findById(id, (err, user) => {
             done(err, user);
          });
       });
   ```

3. **Install Dependencies**

   Configure Express to use sessions and Passport for authentication:

   ```js
   const express = require('express')
   const session = require('express-session')
   const passport = require('passport')
   const app = express()

   app.use(
     session({
       secret: 'your_secret_key',
       resave: false,
       saveUninitialized: true,
     }),
   )

   app.use(passport.initialize())
   app.use(passport.session())
   ```

4. **Create Routes for Authentication**

   Define routes for login and logout:

   ```js
   app.post(
     '/login',
     passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/login',
     }),
   )

   app.get('/logout', (req, res) => {
     req.logout()
     res.redirect('/')
   })
   ```

5. **Protect Routes**

   Use middleware to protect routes that require authentication:

   ```js
   function ensureAuthenticated(req, res, next) {
     if (req.isAuthenticated()) return next()
     res.redirect('/login')
   }

   app.get('/protected', ensureAuthenticated, (req, res) => {
     res.send('This is a protected route')
   })
   ```

This basic setup helps you integrate authentication into an Express.js
application. You can further enhance it by adding user registration, password
reset features, and more.
