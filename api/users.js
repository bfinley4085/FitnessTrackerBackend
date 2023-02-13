/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {createUser, getUserByUsername } = require('../db');
const jwt = require('jsonwebtoken');

// POST /api/users/register
router.post('/api/users/register', async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
    
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message });
    } 
  });

// POST /api/users/login
router.post('/api/users/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password == password) {
        const token = jwt.sign({ 
          id: user.id, 
          username
        }, process.env.JWT_SECRET, {
          expiresIn: '1w'
        });
  
        res.send({ 
          message: "you're logged in!",
          token 
        });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });
// GET /api/users/me
router.get('/api/users/me', async (req, res, next) => {
    try {
        const { username } = req.body
      const users = await getUserByUsername(username);
    
      res.send({
        users
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
// GET /api/users/:username/routines

module.exports = router;
// GET public routines for user