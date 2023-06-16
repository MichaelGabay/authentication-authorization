const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { accessExpires, refreshExpires } = require("../server.config.json");
const generateToken = require("../utils/generatToken");
require("dotenv").config();

const userCtrl = {
    async signup({ body }, res) {
        try {
            body.password = await bcrypt.hash(body.password, 10);
            const user = await userModel.create(body);
            res.json({ status: true, msg: "user created successfully" }).status(201)
        } catch (error) {
            res.json(error)
        }
    },
    async login({ body }, res) {
        const errorObject = { status: false, msg: "error try again" }
        try {
            let { _id, role, password, name } = await userModel.findOne({ email: body.email }, { loggedUsers: 0 });
            console.log("load");

            if (!_id) throw errorObject;
            if (!await bcrypt.compare(body.password, password)) throw errorObject;
            // const refreshToken = jwt.sign({ sub: user._id }, process.env.SECRET_KEY_WORD, { expiresIn: refreshExpires })
            const refreshToken = generateToken({ sub: _id, role }, refreshExpires);
            // const accessToken = jwt.sign({ sub: user._id }, process.env.SECRET_KEY_WORD, { expiresIn: accessExpires })
            const accessToken = generateToken({ sub: _id, role }, accessExpires);
            const logUser = { date: Date.now(), deviceDetails: body.deviceDetails, refreshToken }
            await userModel.updateOne({ _id }, { $push: { loggedUsers: logUser } })
            res.cookie('refreshCookie', "bearer " + refreshToken, { httpOnly: true });
            res.cookie('accessCookie', "bearer " + accessToken);
            res.json({ staus: true, msg: `user ${name} login successfully` })
        }
        catch {
            res.json(errorObject)
        }
    },

    async endConnectionForAll() {

    },
    async endConnection() {

    }
}

module.exports = userCtrl;

