const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // Filter the users array for any user with the same username
  let validusers = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // authenticate user
  if (authenticatedUser(username, password)) {
    // generate token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    // set token in session
    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  /*
  Complétez le code pour ajouter ou modifier une critique de livre.
  Indice : Vous devez fournir une critique en tant que requête et elle doit être publiée avec le nom d’utilisateur (stocké dans la session). 
  Si le même utilisateur publie une critique différente sur le même ISBN, cela doit modifier la critique existante. 
  Si un autre utilisateur se connecte et publie une critique sur le même ISBN, elle sera ajoutée comme une critique différente sous le même ISBN.
  */

  const username = req.session?.authorization?.username; // Vérifie si l'utilisateur est connecté
  console.log(username);
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Validation des champs requis
  if (!username) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not logged in." });
  }
  if (!isbn || !review) {
    return res
      .status(400)
      .json({ message: "All fields (ISBN and review) are required." });
  }

  // Vérifie si l'ISBN existe dans les données des livres
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Initialise les critiques si elles n'existent pas pour ce livre
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Ajoute ou met à jour la critique de l'utilisateur
  books[isbn].reviews[username] = review;

  // Répond avec un message de succès
  return res
    .status(200)
    .json({ message: "Review added or updated successfully." });
});

// Delete a book review
/*
  Hint: Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
*/
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session?.authorization?.username;
  const isbn = req.params.isbn;
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
