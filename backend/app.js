var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
dotenv.config();

// Import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/timelog');

// Import DB connection
const connectDB = require('./connectDB');

var app = express();

// CORS configuration
var corsOptions = {
  origin: '*', // Allow all origins, change this as per your requirements
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// DB connection
connectDB().catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1); // Exit the process if DB connection fails
});

// Routes setup
app.use('/', indexRouter);
app.use('/timelog', usersRouter);

// Catch 404 errors
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, providing error in development only
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Fetch port from environment or use default (3000)
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

// maulika@digiflux.io




// Maulika Vasava
// 11:56
// maulika@digiflux.io
