const express = require("express");
const models = require("./models");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const schema = require("./schema/schema");

const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./services/auth");
const MongoStore = require("connect-mongo")(session);

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

// const MONGODB_URI =
//   "mongodb://cvele:cvelePass@posts-shard-00-00.jzao1.mongodb.net:27017,posts-shard-00-01.jzao1.mongodb.net:27017,posts-shard-00-02.jzao1.mongodb.net:27017/posts?ssl=true&replicaSet=posts-shard-0&authSource=admin&retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("You must provide a MongoLab URI");
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "aaabbbccc",
    store: new MongoStore({
      url: MONGODB_URI,
      autoReconnect: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, function () {
  console.log(`??  ==> API Server now listening on PORT ${PORT}!`);
});
