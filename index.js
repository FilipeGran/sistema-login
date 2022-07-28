const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/connection');
const Login = require('./models/login');
const bcrypt = require('./controller/Bcrypt');
const LoginController = require('./controller/LoginController');
const app = express();
const session = require('express-session');
const Message = require('./models/Message');

// View engine
app.set('view engine', 'ejs');

//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//Public
app.use(express.static('public'));

//Session

app.use(session({
    secret: "60013532755",
    cookie: {
        maxAge: 600000
    }
}));

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Conectado com Sucesso!');
    }).catch((error) => {
        console.log(error);
    });

app.use('/', LoginController);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/accout', (req, res) => {
    res.render('new-user');
});

app.get('/password/retrieve', (req, res) => {
    res.render('retrieve-password');
});

app.listen(8080, (req, res) => {
    console.log('Servidor no Ar');
});