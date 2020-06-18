import "dotenv/config"; // this should always be the first line of code
import { connect } from "mongoose";
import app from "./app";

async function initServer () {
	console.log("Connecting with MongoDB");
	await connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
	console.log("Connected with MongoDB");

	app.listen(process.env.APP_PORT);
	console.log(`App listening on port ${process.env.APP_PORT}...`);
}

initServer();