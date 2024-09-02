# Authentication in Express.js

This guide demonstrates how to implement basic authentication in an Express.js application using JSON Web Tokens (JWT). It covers setting up the project, creating an Express server, implementing user registration and login, and protecting routes.

## Setting up the project

First, install the necessary dependencies:

```bash
npm install express jsonwebtoken bcrypt
```

## Creating the Express server

Set up a basic Express server:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Use environment variables for security

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## User registration

Implement a route for user registration:

```javascript
const users = []; // In a real app, use a database

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});
```

## User login

Create a login route to authenticate users and issue JWT tokens:

```javascript
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});
```

## Protecting routes

Create a middleware to protect routes that require authentication:

```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}
```

Use the middleware to protect routes:

```javascript
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});
```

## Conclusion

This basic authentication system demonstrates how to implement user registration, login, and route protection using Express.js and JWT. Remember to store user data securely, use environment variables for sensitive information, and consider additional security measures like rate limiting and HTTPS in a production environment.
