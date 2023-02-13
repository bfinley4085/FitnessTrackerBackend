const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING users.username;
    `, [username, password]);

    return user;
  } catch (error) {
    throw error;
  }

}

async function getUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT "username", "id"
      FROM users
      WHERE users.password=${password} AND users.username =${username}
    `);

    if (!user) {
      return null
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: user } = await client.query(`
      SELECT "id", "username"
      FROM users
      WHERE id=${userId}
    `);

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
    const { rows: user } = await client.query(`
          SELECT "id", "username"
          FROM users
          WHERE username=${userName}
        `,);

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
