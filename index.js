// index.js - Express 4 compatible server
// Requires: express@4.x, cors, express-async-errors (optional), dotenv (optional)
//
// Install example:
//   npm install express@4 cors express-async-errors dotenv
// Or without express-async-errors:
//   npm install express@4 cors dotenv
//
// If you don't want express-async-errors, see note at the end of this file.

require('express-async-errors'); // makes async errors propagate to Express 4 error handler
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import router
const usersRouter = require('./routes/users');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Připojí router
app.use('/api/users', usersRouter);

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Simple async example (safe because of express-async-errors)
app.get('/api/hello', async (req, res) => {
  const msg = await Promise.resolve('Ahoj z Express 4');
  res.json({ message: msg });
});

// 4-argument error handler required by Express 4
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
});

/*
Note about express-async-errors:
- express-async-errors lets you write async route handlers (async/await) without manually wrapping them.
- If you prefer not to install it, remove the `require('express-async-errors')` line and either:
  1) wrap async handlers with a helper wrapper:
     const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
     and use app.get('/path', asyncHandler(async (req, res) => { ... }));
  2) or ensure every async route has try/catch and calls next(err).

What to do next:
- Run: npm install express@4 cors express-async-errors dotenv
- Start: node index.js
- Or add scripts to package.json:
  "scripts": { "start": "node index.js", "dev": "nodemon index.js" }
*/