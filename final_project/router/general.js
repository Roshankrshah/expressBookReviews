const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  if (books) {
    return res.status(200).json(books);
  }
  return res.status(300).json({ message: "BAD REQUEST" });
});

public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const booksinfo = await axios.get("http://urlofapi");
    if (booksinfo) {
      return res.status(200).json(booksinfo);
    }
  } catch (err) {
    return res.status(501).json({ message: "INTERNAL SERVER ERROR" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (isbn) {
    const bookDetails = books[isbn];
    if (bookDetails)
      return res.status(200).json(bookDetails);
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(300).json({ message: "BAD REQUEST" });
});

public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  try {
    const bookDetails = await axios.get(`http:urlofapi/${isbn}`);
    if (bookDetails)
      return res.status(200).json(bookDetails);
    return res.status(404).json({ message: "Not Found" });
  }
  catch (err) {
    return res.status(300).json({ message: "BAD REQUEST" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const { author: name } = req.params;
  if (name) {
    const bookDetails = Object.values(books).filter((item) => {
      if (item.author == name)
        return true;
      return false;
    });

    if (bookDetails)
      return res.status(200).json(bookDetails);
    else {
      return res.status(404).json({ message: "Not Found" });
    }
  }
  return res.status(300).json({ message: "BAD REQUEST" });
});

public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const { author: name } = req.params;
  try {
    const bookDetails = await axios.get(`http:urlofapi/${name}`);
    if (bookDetails)
      return res.status(200).json(bookDetails);
    else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    return res.status(300).json({ message: "BAD REQUEST" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const { title } = req.params;
  if (title) {
    const bookDetails = Object.values(books).filter((item) => {
      if (item.title == title)
        return true;
      return false;
    });

    if (bookDetails)
      return res.status(200).json(bookDetails);
    else {
      return res.status(404).json({ message: "Not Found" });
    }
  }
  return res.status(300).json({ message: "BAD REQUEST" });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const { title } = req.params;
  try {
    const bookDetails = await axios.get(`http:urlofapi/${title}`);

    if (bookDetails)
      return res.status(200).json(bookDetails);
    else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    return res.status(300).json({ message: "BAD REQUEST" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (isbn) {
    const reviews = books[isbn].reviews;
    if (reviews)
      return res.status(200).json(reviews);
    return res.status(404).json({ message: "Not Found" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
