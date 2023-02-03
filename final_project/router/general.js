const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const exists = (username) => {
    let userswithsamename = users.filter((user) => {
       return user.username === username;
    });
    return (userswithsamename.length > 0);
}

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (exists(username)) {
            return res.status(404).json({ message: "User already exists!" });
        } else {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        }
    }
    if(username){
        return res.status(404).json({ message: "Unable to register user. password not provided!" });
    }else{
        return res.status(404).json({ message: "Unable to register user. username not provided!" });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    let bkArr = [];
    for (var key in books) {
        const book = books[key];
        if (book.author === author) {
            bkArr.push(book);
        }
    }
    res.send(bkArr);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    let bkArr = [];
    for (var key in books) {
        const book = books[key];
        if (book.title === title) {
            bkArr.push(book);
        }
    }
    res.send(bkArr);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
