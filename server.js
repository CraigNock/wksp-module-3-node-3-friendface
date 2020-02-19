'use strict';
const express = require('express');

const morgan = require('morgan');

const { users } = require('./data/users');

const PORT = process.env.PORT || 8000;

//variables
let currentUser = null;

let friendArr = [];


const friendly = (user) => {
    user.friends.forEach(friend => {
        friendArr.push(users.find(user => user.id === friend))
    });
    console.log(friendArr);
};



const handleHome = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return};
    friendly(currentUser);
    res.render('pages/homepage', {
        title: `Welcome ${currentUser}`,
        user: currentUser,
        friendsArr: friendArr
    });
};

const handleSignin = (req, res) => {
    if (currentUser) {res.redirect('/'); return};
    res.render('pages/signin', {
        title: 'Signin'
    });
};

const handleUser = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return};

    let id = req.params.id;
    res.send(`User id is ${id}`);
};

const handleName = (req, res) => {
    const firstName = req.query.firstName;
    console.log(firstName);
    currentUser = users.find(user => user.name === firstName) || null;
    console.log(currentUser);
    res.redirect(`${currentUser ? '/' : '/signin'}`);
};

// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')
    
    // endpoints

    .get('/', handleHome)

    .get('/signin', handleSignin)

    .get('/user/:id', handleUser)

    .get('/getname', handleName)

    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));