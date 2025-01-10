const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
  }
  return res
    .status(400)
    .json({ message: "Username and password are required" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Use a Promise to simulate fetching the book list
  new Promise((resolve, reject) => {
    // Simulate success by resolving the Promise
    if (books) {
      resolve(books);
    } else {
      reject(new Error("No books available"));
    }
  })
    .then((bookList) => {
      // Respond with the list of books on success
      res.status(200).json(JSON.stringify(bookList, null, 2));
    })
    .catch((error) => {
      // Respond with an error message on failure
      res.status(500).json({ message: error.message });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    if (books[req.params.isbn]) {
      resolve(books[req.params.isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Create a Promise to fetch books by author
  new Promise((resolve, reject) => {
    const author = req.params.author;

    if (!author) {
      return reject(new Error("Author parameter is required"));
    }

    // Get all keys of the books object
    let keys = Object.keys(books);

    // Filter the books by author
    const booksByAuthor = keys
      .filter((key) => books[key].author === author)
      .map((key) => books[key]);

    // Resolve the Promise with the filtered books
    resolve(booksByAuthor);
  })
    .then((booksByAuthor) => {
      // Send the response with the books
      return res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      // Handle errors
      return res.status(400).json({ message: error.message });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;

    if (!title) {
      return reject(new Error("Title parameter is required"));
    }

    let keys = Object.keys(books);
    const booksByTitle = keys.filter(
      (key) => books[key].title === req.params.title
    );
    resolve(booksByTitle);
  })
    .then((booksByTitle) => {
      return res.status(200).json(booksByTitle);
    })
    .catch((error) => {
      return res.status(400).json({ message: error.message });
    });
  //Write your code here
  // let keys = Object.keys(books);
  // const booksByTitle = keys.filter(
  //   (key) => books[key].title === req.params.title
  // );
  // return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  // Indice : Obtenez les critiques de livres en fonction de l’ISBN fourni dans les paramètres de la requête.
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
