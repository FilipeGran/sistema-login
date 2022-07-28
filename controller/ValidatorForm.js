const Bcrypt = require('./Bcrypt');

class Validator {
    static validateEmail(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (regex.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    static ValidateName(name) {
        if (name.length > 5) {
            return true;
        } else {
            return false;
        }
    }

    static Validatepassword(password) {
        if (password.length > 4) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Validator;