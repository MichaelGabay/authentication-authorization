const { signup, login, endConnection, endConnectionForAll } = require("../controllers/userController")
const { auth } = require("../middlewares/authMiddleware")
const router = require("express").Router()

// signup
router.post("/signup", signup)

// login
router.post("/login", login)

router.delete("/endConnectionForAll", auth, endConnectionForAll)

router.delete("/endConnection", auth, endConnection)

router.get("/getUser",)

module.exports = router