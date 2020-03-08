'use strict';
const express = require('express');

const morgan = require('morgan');

const { users } = require('./data/users');

const PORT = process.env.PORT || 8000;

//variables
let currentUser = null;
let selectUser = null;


const friendly = (user) => {
    let friendArr = [];
    user.friends.forEach(friend => {
        friendArr.push(users.find(user => user.id === friend))
    });
    console.log(friendArr);
    return friendArr;
};

const unfriendly = (user) => {
    let friendArr = users;
    friendArr = friendArr.filter(user => user.id !== currentUser.id);
    user.friends.forEach(friend => {
        friendArr = friendArr.filter(user => user.id !== friend)
    });
    return friendArr;
}

const handleHome = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return};
    let friendArray = friendly(currentUser);
    res.render('pages/homepage', {
        title: `Welcome ${currentUser.name}`,
        user: currentUser,
        friendArr: friendArray
    });
};

const handleSignin = (req, res) => {
    if (currentUser) {res.redirect('/'); return};
    res.render('pages/signin', {
        title: 'Signin'
    });
};

const handleSignout = (req, res) => {
    currentUser = null;
    res.redirect('/');
}

const handleFinder = (req, res) => {
    let friendArray = unfriendly(currentUser);
    res.render('pages/find', {
        title : 'Friend Finder',
        friendArr: friendArray
    })
};

const userUpdate = () =>{
    users.forEach(user => {
        if (user.id === currentUser.id){
            user = currentUser;
        }
    })
}

const handleAddRem = (req, res) => {
    let id = req.params.id;
    let action = req.params.action;
    if(action === 'add'){
        currentUser.friends.push(id);
    } else {
    currentUser.friends = currentUser.friends.filter(friend => friend !== id);
    }
    userUpdate();
    res.redirect('/');
};

const handleUser = (req, res) => {
    if (!currentUser) {res.redirect('/signin'); return};
    let id = req.params.id;
    selectUser = users.find((user) => user.id == id);
    console.log(selectUser);
    let friendArray = friendly(selectUser);
    console.log(friendArray);
    res.render('pages/user', {
        title:`Visiting ${selectUser.name}`,
        user: selectUser,
        friendArr: friendArray,
        currentUser: currentUser
    });
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

    .get('/signout', handleSignout)

    .get('/user/:id', handleUser)

    .get('/find', handleFinder)

    .get('/getname', handleName)
    
    .get('/friend/:id/:action', handleAddRem)


    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));