import environment from "../../src/config/environment";
import { connectDB } from '../../src/config/mongo';
import UserModel from '../../src/models/user.model';
import { expect, jest } from "@jest/globals";
import mongoose from "mongoose";

const { MONGO_URI } = environment;

describe("Pruebas unitarias clase user.model", () => {
  beforeAll(async () => {
    await connectDB(MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  test("Crear un usuario y encriptar password", async () => {
    const userData = {
      name: "Alejandro Vera",
      email: "avera@gmail.com",
      password: "1234",
      rut: "205659234",
      verified: false,
      blocked: false,
      code: "1qaz2wsx",
    };

    const bcryptHashMock = jest.spyOn(UserModel.prototype, "bcryptHash");

    const user = new UserModel(userData);
    await user.save();

    expect(bcryptHashMock).toHaveBeenCalled();
    expect(user.password).not.toBe(userData.password);

    bcryptHashMock.mockRestore();
  });

  test("Compara la contraseña correctamente", async () => {
    const userData = {
        name: "Alejandro Vera",
        email: "avera@gmail.com",
        password: "1234",
        rut: "205659234",
        verified: false,
        blocked: false,
        code: "1qaz2wsx",
    };

    const password = "1234";

    const user = new UserModel(userData);
    await user.save();

    const bcryptCompareMock = jest.spyOn(UserModel.prototype, "bcryptCompare");

    const isPasswordMatched = await user.comparePassword(password);
    expect(bcryptCompareMock).toHaveBeenCalledWith(password, user.password);
    expect(isPasswordMatched).toBe(true);

    bcryptCompareMock.mockRestore();
  });

  test("Verificacion del usuario", async () => {
    const userData = {
        name: "Alejandro Vera",
        email: "avera@gmail.com",
        password: "1234",
        rut: "205659234",
        verified: false,
        blocked: false,
        code: "1qaz2wsx",
    };

    const user = new UserModel(userData);
    await user.save();

    const saveMock = jest.spyOn(UserModel.prototype, "save");

    await user.setVerified();
    const updatedUser = await UserModel.findById(user._id);

    expect(updatedUser.verified).toBe(true);
    expect(updatedUser.code).toBeUndefined();
    expect(saveMock).toHaveBeenCalled();

    saveMock.mockRestore();
  });
});
