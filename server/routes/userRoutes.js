const { signup, login, endConnection, endConnectionForAll } = require("../controllers/userController")
const router = require("express").Router()

// signup
router.post("/signup", signup)

// login
router.post("/login", login)

router.delete("/endConnectionForAll", endConnectionForAll)

router.delete("/endConnection", endConnection)



module.exports = router