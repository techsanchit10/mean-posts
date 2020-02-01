// --------- NOTE -----------
// Since we added auto reload using a package : nodemon and added it to package.json. We have to run server.js file using:
// npm run start:server
// --------- END --------


const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://sanchit:" + process.env.MONGO_ATLAS_PW + "@cluster0-ghn4u.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database successfully');
})
.catch(() => {
  console.log('Connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));



// The following is important for Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
// ------------------------------------------------------------------

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;


