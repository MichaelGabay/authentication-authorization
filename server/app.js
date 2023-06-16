const express = require("express")
const mainRoutes = require("./routes/mainRoutes")
const cors = require("cors")
const cookieParser = require('cookie-parser');
require("./db/dbConnector")

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization", "token", "access-key"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))
mainRoutes(app)
const port = process.env.PORT || 3000
app.listen(port, () => console.log("server is running on port " + port))


