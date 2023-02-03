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

    // check valid username
    if (!isValid(username)) {
        return res.status(404).json({ message: "Unable to register user. Invalid username!" });
    }

    // check existing username
    if (exists(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }

    // if password is provided
    if (password) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
        return res.status(404).json({ message: "Unable to register user. password not provided!" });
    }
});

const listBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    })
};

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    // improvement with callbacks
    listBooks().then(bookList => res.send(JSON.stringify(bookList)));
});


const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book with isbn '" + isbn + "' not found!" });
        }
    })
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    getBookByIsbn(isbn)
        .then(
            book => res.send(book),
            err => res.status(err.status).json({ message: err.message })
        );
});


const listBooksByAuthor = (author) =>{
    return new Promise((resolve) => {
        let bkArr = [];
        for (var key in books) {
            const book = books[key];
            if (book.author === author) {
                bkArr.push(book);
            }
        }
        resolve(bkArr);
    })
};
 
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    listBooksByAuthor(author).then(authBooks => res.send(authBooks));
});


const listBooksByTitle = (title) =>{
    return new Promise((resolve) => {
        let bkArr = [];
        for (var key in books) {
            const book = books[key];
            if (book.title === title) {
                bkArr.push(book);
            }
        }
        resolve(bkArr);
    })
};

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    listBooksByTitle(title).then(titleBooks => res.send(titleBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
