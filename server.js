const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const bootCampRouter = require('./routes/bootcamps');
const courseRouter = require('./routes/courses');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const reviewRouter = require('./routes/reviews');
require('colors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// dev logging middleware
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './config/production.env' });
} else {
  app.use(morgan('dev'));
  dotenv.config({ path: './config/config.env' });
}

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// file upload middleware
app.use(fileUpload());

// create and setup static directory
const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use(express.static(path.join(__dirname, 'public')));

// security middlewares
app.use(mongoSanitize()); // sanitize data to prevent sql injections
app.use(helmet()); // add useful security headers
app.use(xss()); // prevent xss attacks
app.use(hpp()); // prevent parameter pollution
app.use(cors()); // protect against cors attacks
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 request in 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
); // rate limit

// add routes middlewares
app.use('/api/v1/bootcamps', bootCampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/5295552/Uzs6zPSy');
});

// global error handler
app.use(errorHandler);

async function startServer() {
  try {
    // connect to mongoDB
    await connectDB();

    // start server
    const PORT = process.env.PORT || 5000;
    app.listen(
      PORT,
      console.log(
        `Server stated in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
          .bold
      )
    );
  } catch (err) {
    console.log(`Server start failed. Cause: ${err.message}`.red.bold);
  }
}

startServer();
