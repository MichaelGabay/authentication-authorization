const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const { accessExpires, refreshExpires } = require("../server.config.json");
const generateToken = require("../utils/generatToken");
require("dotenv").config();

const userCtrl = {
    async signup({ body }, res) {
        try {
            body.password = await bcrypt.hash(body.password, 10);
            const user = await userModel.create(body);
            res.status(201).json({ message: "user created successfully" })
        } catch (error) {
            if (error.code == 11000) {
                return res.status(409).json({ message: "user already exist" })
            }
            res.status(500).json(error)
        }
    },
    async login({ body }, res) {
        try {
            let { _id, role, password, name } = await userModel.findOne({ email: body.email }, { loggedUsers: 0 }) || {};
            if (!_id) return res.status(404).json({ message: "user not found" })

            if (!await bcrypt.compare(body.password, password)) {
                return res.status(401).json({ message: "incorrect details" })
            }
            const refreshToken = generateToken({ sub: _id, role }, refreshExpires);
            const accessToken = generateToken({ sub: _id, role }, accessExpires);
            // create login details object
            const logUser = { date: Date.now(), deviceDetails: body.deviceDetails, refreshToken }
            await userModel.updateOne({ _id }, { $push: { loggedUsers: logUser } })
            res.cookie('refreshCookie', "bearer " + refreshToken, { httpOnly: true });
            res.cookie('accessCookie', "bearer " + accessToken);
            res.status(200).json({ message: `user ${name} login successfully` })
        }
        catch (error) {
            res.status(500).json(error)
        }
    },

    async endConnectionForAll(req, res) {
        try {
            const user = await userModel.updateOne({ _id: req.user.sub }, { loggedUsers: [] })

            // user.save()
            res.status(200).json({ message: "disconnection successful for all users" });

        } catch (error) {
            res.status(500).json(error)
        }
    },
    async endConnection({ body, user }, res) {
        try {
            userModel.updateOne({ _id: user.sub }, { $pull: { loggedUsers: { _id: body.refreshId } } })
            res.status(200).json({ message: "disconnected successful" });
        }
        catch (error) {
            res.status(500).json(error)
        }
    },
    async getUser({ user }, res) {
        try {
            const myUser = await userModel.findOne({ _id: user.sub }, { "loggedUsers.refreshToken": 0, password: 0 })


            res.status(200).json(myUser)
        } catch (error) {
            res.status(400).json(error)
        }
    }

}

module.exports = userCtrl;

