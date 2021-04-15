const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");

const mongoose = require("mongoose");
const path = require("path");

const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb+srv://guest:guest1@cluster0.ssyxf.mongodb.net/projet6?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error));

const app = express();

require('dotenv').config()

const hostname = process.env.HOST;
const database = process.env.DATABASE;
const port = process.env.PORT;
const user = process.env. USER


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });
 //limiteur de password pour attaque en force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
 
app.use("/api/", apiLimiter);
app.use(helmet()); 
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);



console.log(hostname);
console.log(database);
console.log(port);
console.log(user)

module.exports = app; 
