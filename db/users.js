const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING username, id;
    `, [username, hashedPassword]);

    return user;
  } catch (error) {
    throw error;
  }

}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordMatch) {
      const { rows: [user] } = await client.query(`
      SELECT "username", "id"
      FROM users
      WHERE username=$1 AND password =$2
    `, [username, hashedPassword]);

      return user;
    } else {
      return null
    }
  }
  catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT "id", "username"
      FROM users
      WHERE id= $1;
    `, [userId]);

    if (!user) {
      return null
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
          SELECT *
          FROM users
          WHERE username= $1;
        `, [userName]);

    if (!user) {
      return null
    } return user
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
