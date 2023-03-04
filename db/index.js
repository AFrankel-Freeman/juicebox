const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox_dev');

const createUser = async ({ username, password, name, location }) => {
  try {
    const { rows: [user] } = await client.query (`
      INSERT INTO users(username, password, name, location)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch(err) {
    throw err;
  }
}

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
    SELECT id, username, name, location, active 
    FROM USERS;
    `);

    return rows;
  } catch (err) {
    throw err;
  }
}


const getUserById = async (userId) => {
  try {
    const { rows: [user] } = await client.query (`
    SELECT id, username, name, location, acitve
    FROM users
    WHERE id=${ userId }
    `);
    
    if (!user) {
      return null
    }

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (err) {
    throw err;
  }
}

const updateUser = async(id, fields = {}) => {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1} `
    ).join(',');

  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
      `, Object.values(fields));

    return user;
  } catch (err) {
    throw err;
  }
}

const createPost = async ({authorID, title, content}) => {
  try{

  } catch (err) {
    throw err;
  }
}

const updatePost = async (id, fields = {}) => {

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
  ).join(', ');

  if (setString.length === 0){
    return;
  }

  try{
    const { rows: [post] } = await client.query(`
      UPDATE posts
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));
    
    return post;
  } catch (err) {
    throw err;
  }
}

const getAllPosts = async () => {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM posts;
    `);
    
    return rows;
  } catch (err) {
    throw err;
  }
}

const getPostsByUser = async(userId) => {
  try {
    const {rows} = await client.query (`
      SELECT * FROM posts
      WHERE "authorId" =${ userId };
    `);
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost, 
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById
}