const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./services/auth');
const MongoStore = require('connect-mongo')(session);
const schema = require('./schema/schema');

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client"));
}

// const MONGO_URI = "mongodb+srv://cvele:cvelePass@posts2.hdhko.mongodb.net/posts2?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoDB instance.'))
  .on('error', error => console.log('Error connecting to MongoDB:', error));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(PORT, function () {
  console.log(`??  ==> API Server now listening on PORT ${PORT}!`);
