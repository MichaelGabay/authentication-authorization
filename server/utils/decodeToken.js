const jwt = require("jsonwebtoken");
require("dotenv").config();


const decodeToken = (token) => {
    try {
        return { userPayload: jwt.verify(token, process.env.SECRET_KEY_WORD) }
    }
    catch {
        return { error: true };
    }
}
module.exports = decodeToken;