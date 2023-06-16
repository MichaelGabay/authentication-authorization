const mongoose = require("mongoose");
require("dotenv").config();

connectToDb();
async function connectToDb() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");

    } catch (error) {
        console.log(error);
    }
}


