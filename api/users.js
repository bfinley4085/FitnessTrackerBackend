/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, PasswordTooShortError } = require("../errors");

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
       if (password.length < 8) {
          next({
             name: 'PasswordShortError',
             error: PasswordTooShortError(),
          });
       }
 
       if (await getUserByUsername(username)) {
          next({
             name: 'UserExistError',
             message: `User ${username} is already taken.`,
             error: 'Error!',
          });
       }
       const user = await createUser({ username, password });
       const token = jwt.sign(
          {
             id: user.id,
             username: user.username,
          },
          process.env.JWT_SECRET,
       );
 
       res.send({
          user,
          message: 'Thank you for signing up',
          token,
       });
    } catch (error) {
       next(error);
    }
 });

// POST /api/users/login
usersRouter.post('/api/users/login', async (req, res, next) => {
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
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// GET /api/users/me
usersRouter.get('/me', async (req, res, next) => {
    try {
        res.send(
            req.users
        );
    } catch {
        res.status(401);
        res.send({
            name: "unauthorized Error", message: UnauthorizedError(),
            error: UnauthorizedError()
        })
    }
});
// GET /api/users/:username/routines
usersRouter.get('/:username/routines', async (req, res, next) => {
    try {
       const username = req.params;
 
       if (req.user && username.username === req.user.username) {
          const routinesByUser = await getAllRoutinesByUser(username);
          res.send(routinesByUser);
       } else {
          const response = await getPublicRoutinesByUser(username);
          res.send(response);
       }
    } catch (error) {
       next(error);
    }
 });
module.exports = usersRouter;
// GET public routines for user