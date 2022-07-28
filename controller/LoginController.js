const express = require('express');
const Validator = require('../controller/ValidatorForm');
const Login = require('../models/login');
const bcrypt = require('../controller/Bcrypt');
const auth = require('../middleware/LoginAuthenticate');
const Message = require('../models/Message');
const router = express.Router();

router.post('/accout', (req, res) => {
    let {
        name,
        email,
        password
    } = req.body;

    if (Validator.ValidateName(name) && Validator.validateEmail(email) && Validator.Validatepassword(password)) {
        const hash = bcrypt.encrypt(password);
        Login.findOne({
            where: {
                email: email
            }
        }).then((login) => {
            console.log(login);
            if (login === null) {
                Login.create({
                    name: name,
                    email: email,
                    password: hash
                }).then(() => {
                    let message = new Message('Cadastro Realizado com Sucesso!',
                        'realize o login', true);
                    res.render('message', {
                        message
                    });
                }).catch((error) => {
                    res.send('Erro!');
                });
            } else {
                let message = new Message('Email já cadastrado!', 'Utilize outro email', false);
                res.render('message', {
                    message
                });
            }
        }).catch((error) => {
            res.send(error);
        })
    } else {
        let message = new Message('Formulário Incorreto!',
            'Regras: utilize um email válido, nom com no mínimo 5 caracteres e senha com no mínimo 4 caracteres', false);
        res.render('message', {
            message
        });
    }
});

router.post('/login', (req, res) => {
    let {
        email,
        password
    } = req.body;

    if (Validator.validateEmail(email) && Validator.Validatepassword(password)) {
        Login.findOne({
            where: {
                email: email
            }
        }).then((user) => {
            if (user !== undefined) {
                let comparePassword = bcrypt.comparePassword(password, user.password);
                if (comparePassword) {
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        password: password
                    }
                    res.render('panel-admin', {
                        user
                    });
                } else {
                    let message = new Message('Senha Incorreta!',
                        'Verifique sua senha. Caso Não lembra da senha tente recupera-lá', false);
                    res.render('message', {
                        message
                    });
                }
            } else {
                let message = new Message('Usuário não encontrado!',
                    'Verifique as informações informadas!', false);
                res.render('message', {
                    message
                });
            }
        })
    } else {
        let message = new Message('Email ou Senha Incorretos!',
            'Verifique seu email e senha. Caso Não lembra da senha tente recupera-lá', false);
        res.render('message', {
            message
        });
    }
});

router.get('/user', auth, (req, res) => {
    const user = req.session.user;
    res.render('panel-admin', {
        user
    });
});

router.get('/user/edit', auth, (req, res) => {
    let user = req.session.user;
    res.render('update-user', {
        user: user
    });
});

router.post('/user/update', auth, (req, res) => {
    let user = {
        id: req.session.user.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    if (Validator.validateEmail(user.email) && Validator.Validatepassword(user.password) && Validator.ValidateName(user.name)) {

        let hash = bcrypt.encrypt(user.password);

        Login.update({
            name: user.name,
            email: user.email,
            password: hash
        }, {
            where: {
                id: user.id
            }
        }).then(() => {
            let message = new Message('Alterações realizadas com sucesso!',
                'É necessário realizar o login novamente!', true);
            res.render('message', {
                message
            });
        });
    } else {
        res.send('Form preenchido errado!');
    }

});

router.get('/logout', auth, (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

router.post('/password/retrieve', (req, res) => {
    let {
        email,
        password,
        passwordRepeat
    } = req.body;

    Login.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (user !== null) {
            if (password === passwordRepeat) {
                Login.update({
                    password: bcrypt.encrypt(password)
                }, {
                    where: {
                        email: email
                    }
                }).then(() => {
                    let message = new Message('Senha recuperada',
                        'Faça login com sua nova senha!', true);
                    res.render('message', {
                        message
                    });
                });
            } else {
                let message = new Message('Senhas diferentes',
                    'senhas informadas não são iguais', false);
                res.render('message', {
                    message
                });
            }
        } else {
            let message = new Message('Email Inválido',
                'Não Existe Usuário cadastrado no sistema com esse email, verifique o email', false);
            res.render('message', {
                message
            });
        }
    })
});

module.exports = router;