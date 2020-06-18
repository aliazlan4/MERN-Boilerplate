import { Router } from "express";
import passport from "./passport";

// import all the controllers here
import * as UsersController from "./services/users/users.controller";

// api prefix of app. it can be used as /api/v1/ etc.
const API_PREFIX = "/api/";

// All the public routes of app
const public_routes = {
	"POST /auth/register": [ UsersController.register ],
	"POST /auth/login": [ passport.authenticate("local"), UsersController.loginSuccessful ],
};

// All the routes that requires user to be logged in
const authenticated_routes = {
	"GET /auth/user": [ UsersController.getUser ],
	"GET /auth/logout": [ UsersController.logout ],
};

export default (app) => {
	const router = Router();

	for (const route in public_routes) {
		const [ method, url ] = route.split(" ");
		router.route(url)[method.toLowerCase()](public_routes[route]);
	}

	for (const route in authenticated_routes) {
		const [ method, url ] = route.split(" ");
		router.route(url)[method.toLowerCase()]([passport.is_authenticated, ...authenticated_routes[route]]);
	}

	app.use(API_PREFIX, router);
};