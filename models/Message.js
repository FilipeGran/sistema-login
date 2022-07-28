class Message {
    constructor(header, body, logout) {
        this.header = header;
        this.body = body;
        this.logout = logout;
    }
}

module.exports = Message;