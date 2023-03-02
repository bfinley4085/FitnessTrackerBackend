require("dotenv").config();
const { PORT = 3000 } = process.env;
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const morgan = require('morgan');
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

  const apiRouter = require('./api');
app.use('/api', apiRouter);


module.exports = app;
