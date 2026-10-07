const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Internal book data endpoint
public_users.get('/api/books', (req, res) => {
  return res.status(200).json(books);
});

// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5000/api/books'
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5000/api/books'
    );

    const isbn = req.params.isbn;

    if (response.data[isbn]) {
      return res.status(200).json(response.data[isbn]);
    }

    return res.status(404).json({
      message: "Book not found"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve book"
    });
  }
});

// Get books based on author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5000/api/books'
    );

    const author = req.params.author.toLowerCase();

    const result = Object.values(response.data).filter(
      book => book.author.toLowerCase() === author
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get books based on title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5000/api/books'
    );

    const title = req.params.title.toLowerCase();

    const result = Object.values(response.data).filter(
      book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

module.exports.general = public_users;