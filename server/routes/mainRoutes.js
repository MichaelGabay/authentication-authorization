const { auth } = require("../middlewares/authMiddleware");
const userRoute = require("./userRoutes")

const mainRoutes = (app) => {
    app.use("/test", (_, res) => res.send("server is working"))
    app.use("/user", userRoute);
    app.use("/auth", auth, ({ user }, res) => res.status(200).json({ msg: ` secsesfully authenticated--> role: ${user.role} ,id: ${user.sub}` }))
}
module.exports = mainRoutes;