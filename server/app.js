import express from "express";
import session from "express-session";
import Mongoose from "mongoose";
import ConnectMongo from "connect-mongo";
import { resolve } from "path";
import passport from "./passport";
import app_router from "./router";

// Create the express application
const app = express();

// Setup session middleware
const MongoStore = ConnectMongo(session);
app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: Mongoose.connection })
}));

// Setup parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup auth middlewares
app.use(passport.initialize());
app.use(passport.session());

// Configure app routes
app_router(app);

// Declare the path to frontend's static assets
app.use(express.static(resolve("build")));

// Intercept requests to return the frontend's static entry point
app.get("*", (_, response) => {
	response.sendFile(resolve("build", "index.html"));
});

export default app;
