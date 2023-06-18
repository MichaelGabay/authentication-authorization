const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const { accessExpires, refreshExpires, makeRetouch } = require("../server.config.json")
require("dotenv").config();
const generateToken = require("../utils/generatToken.js")

exports.auth = async (req, res, next) => {
    const errorObject = { message: "unauthorized" };
    let userPayload = {};
    try {
        // trying to decode the access token
        const accessToken = req.cookies.accessCookie.split(" ")[1];
        if (!accessToken) throw errorObject;
        try {
            userPayload = jwt.verify(accessToken, process.env.SECRET_KEY_WORD);
            req.user = userPayload;
            return next();
        }
        catch {
            console.log("checking if refresh token is valid");
        }
        // checking if the refresh token is valid token
        const refreshToken = req.cookies.refreshCookie.split(' ')[1];
        if (!refreshToken) throw errorObject;
        try {
            userPayload = jwt.verify(refreshToken, process.env.SECRET_KEY_WORD)
            req.user = userPayload;
        }
        catch {
            throw errorObject;
        }

        // if we don't wonts to retouch the user
        if (!makeRetouch) {
            // chicking if the refresh token is exists in the db
            const { _id } = await userModel.findOne({ _id: userPayload.sub, "loggedUsers.refreshToken": refreshToken }, { _id: 1 })
            if (!_id) throw errorObject;
        }
        // if we want's
        else {
            console.log("making retuch");
            const newRefreshToken = generateToken({ sub: userPayload.sub, role: userPayload.role }, refreshExpires);
            // updating the refresh in db
            const { modifiedCount } = await userModel.updateOne({ _id: userPayload.sub, "loggedUsers.refreshToken": refreshToken }, { "loggedUsers.$.refreshToken": newRefreshToken })
            //  if the refresh not exsist in the db  
            if (modifiedCount != 1) throw errorObject;
            res.cookie('refreshCookie', "bearer " + newRefreshToken);
        }
        const newAccessToken = generateToken({ sub: userPayload.sub, role: userPayload.role }, accessExpires);
        res.cookie('accessCookie', "bearer " + newAccessToken);
        next();
    }
    catch (error) {
        return res.status(401).json(error);
    }
}


exports.authAdmin = ({ user: { role } }, res, next) => {
    if (role == "admin") next();
    else {
        return res.status(401).json({ message: "unauthorized" })
    }
}


