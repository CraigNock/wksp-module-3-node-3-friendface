'use strict';

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('boo');
});

app.listen(9000, () => console.log('listnin on 9k'));