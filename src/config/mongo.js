import mongoose from "mongoose";
import environment from "./environment.js";

const { MONGO_URI } = environment;

/**
 * Mongo DB connection
 * @returns {Promise<mongoose>}
 */
async function connectDB() {
	mongoose.set("strictQuery", true);
	return mongoose.connect(MONGO_URI).catch((err) => {
		console.log(`Failed in connectDB funcion: ${err}`);
		process.exit(-1);
	});
}

async function mongoDisconnect() {
	await disconnect();
}

export {connectDB, mongoDisconnect };