const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username ) {
        return res.status(404).json({ message: "Error logging in, username not provided!" });
    }
    if(!password){
        return res.status(404).json({ message: "Error logging in, password not provided!" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Please check username & password!" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res, next) => {
    //Write your code here
    const username = req.session?.authorization?.username;
    const review = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    //   adds the review for user else updates the old review
    // using {<key value>} i.e. {<user:review>} structure for quick filter
    book.reviews[username] = review;

    // console.log("update review");
    // console.log(books[isbn].reviews);
    return res.status(200).send("User Review successfully Added!");
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session?.authorization?.username;
    const isbn = req.params.isbn;
    const book = books[isbn];
    // using {<key value>} structure for quick filter
    if (book?.reviews[username]) {
        delete book.reviews[username];
    }
    // console.log("delete review");
    // console.log(books[isbn].reviews);
    return res.status(200).send("User Review successfully Deleted!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
