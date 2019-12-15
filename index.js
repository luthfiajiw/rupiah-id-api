const express = require('express');
const http = require('http');

const connection = require('./config/connection');
const cityModel = require('./models/City');
const provinceModel = require('./models/Province');
const subdistrictModel = require('./models/Subdistrict');

const userControllers = require('./controllers/userControllers');
const productControllers = require('./controllers/productControllers');
const categoryControllers = require('./controllers/categoryControllers');

const app = express();

// Body parser
app.use(express.urlencoded({extended: false}));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  };
  next();
})

// Controllers
userControllers(app);
productControllers(app);
categoryControllers(app);

// Connection to the database
connection
  .sync()
  .then(() => {
    const server = app.listen(3000, () => {
      console.log('Your port is listening');
    });
  })
  .catch(err => {
    console.log('Unable to connect to the database ', err);
  })
