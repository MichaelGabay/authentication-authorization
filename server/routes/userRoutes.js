const { signup, login, endConnection, endConnectionForAll, getUser } = require("../controllers/userController")
const { auth, authAdmin } = require("../middlewares/authMiddleware")
const router = require("express").Router()

// signup
router.post("/signup", signup)

// login
router.post("/login", login)

router.delete("/endConnectionForAll", auth, endConnectionForAll)

router.delete("/endConnection", auth, endConnection)


router.get("/getUser", auth, getUser)

module.exports = router