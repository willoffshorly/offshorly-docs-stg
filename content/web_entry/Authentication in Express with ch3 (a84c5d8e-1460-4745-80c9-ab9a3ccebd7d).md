# Authentication in Express

Authentication is crucial for web application security, ensuring only authorized
users access certain resources. This guide covers a basic implementation of
authentication in an Express application.

## Setting Up Authentication

### 1. Install Dependencies

Install necessary packages:

```bash
npm install express express-session passport passport-local bcryptjs dotenv express-validator express-rate-limit helmet
```

### 2. Configure Passport

Create a `passport.js` file:

```javascript
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'Incorrect username.' })
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err)
        if (isMatch) return done(null, user)
        else return done(null, false, { message: 'Incorrect password.' })
      })
    })
  }),
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user)),
)
```

### 3. Configure Express

Configure Express:

```javascript
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
)

app.use(passport.initialize())
app.use(passport.session())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use('/login', limiter)
```

### 4. Create Routes for Authentication

Define routes:

```javascript
const { body, validationResult } = require('express-validator')

app.post(
  '/login',
  [
    body('username').isLength({ min: 5 }),
    body('password').isLength({ min: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
)

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    res.redirect('/')
  })
})
```

### 5. Protect Routes

Use middleware to protect routes:

```javascript
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ message: 'Unauthorized' })
}

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('This is a protected route')
})
```

This setup provides a more secure authentication system. Remember to use HTTPS
in production and implement user registration with password hashing.
