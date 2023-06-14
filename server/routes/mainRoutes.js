const mainRoutes = (app) => {
    app.use("/test", (req, res) => {
        res.send("server is running")
    })
}

module.exports = mainRoutes;