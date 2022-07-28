const bcrypt = require('bcryptjs');

class Bcrypt {
    static encrypt(password) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        return hash;
    }

    static comparePassword(password, passwordDB) {
        if (password !== undefined) {
            let isPasswors = bcrypt.compareSync(password, passwordDB);

            if (isPasswors) {
                return true;
            } else {
                return false;
            }
        } else {
            console.log('Erro!');
        }
    }
}

module.exports = Bcrypt;