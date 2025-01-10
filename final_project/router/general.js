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
  //Write your code here
  // return res.status(200).json(books);
  // Indice :Utilisez la méthode JSON.stringify pour afficher la sortie de manière soignée.
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  // Indices :
  // 1. Obtenez toutes les clés de l’objet ‘books’.
  // 2. Parcourez le tableau ‘books’ et vérifiez si l’auteur correspond à celui fourni dans les paramètres de la requête.
  let keys = Object.keys(books);
  const booksByAuthor = keys.filter(
    (key) => books[key].author === req.params.author
  );
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let keys = Object.keys(books);
  const booksByTitle = keys.filter(
    (key) => books[key].title === req.params.title
  );
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  // Indice : Obtenez les critiques de livres en fonction de l’ISBN fourni dans les paramètres de la requête.
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
