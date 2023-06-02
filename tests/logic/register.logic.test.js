import { connectDB, mongoDisconnect } from "../../src/config/mongo";
import { expect, jest } from "@jest/globals";
import { UserModel } from '../../src/models/user.model';
import { register } from "../../src/logic/register.logic";
import { HTTPError } from "../../src/helpers/error.helper";
import mongoose from "mongoose";

jest.mock("../../src/services/registro-civil.service.js");
jest.mock("../../src/models/user.model.js");
jest.mock("../../src/services/notification.service.js");
jest.mock("../../src/helpers/jwt.helper.js");


const { MONGO_URI } = environment;

describe("Business Logic: Register unit test", () => {
	beforeAll(async () => {
		await connectDB(MONGO_URI);
		
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("[ERROR] When user is already registered", async () => {
		const existingUser = {
			email: "avera@gmail.com",
			rut: "20.565.923-4",
		};

		UserModel.findOne.mockResolvedValue(existingUser);
		const getCriminalRecordsMock = jest.spyOn(
			require("../../src/services/registro-civil.service.js"),
			"getCriminalRecords"
		);

		getCriminalRecordsMock.mockResolvedValue(true);

		const user = {
		    name: "Alejandro Vera",
        	email: "avera@gmail.com",
            password: "1234",
            rut: "20.565.923-4",
            verified: false,
            blocked: false,
            code: "1qaz2wsx",
		};

		try {
			await register(user);
		} catch (error) {
			expect(error).toBeInstanceOf(HTTPError);
			expect(error.code).toEqual(400);
			expect(error.msg).toEqual("El usuario ya existe");
		}
	});
});
