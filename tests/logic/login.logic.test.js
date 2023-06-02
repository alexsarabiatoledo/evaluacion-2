import UserModel from "../../src/models/user.model.js";
import login from "../../src/login.js";
import { HTTPError } from "../../src/helpers/error.helper.js";

jest.mock("../../src/models/user.model.js", () => ({
  findOne: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  })),
}));

jest.spyOn(UserModel.prototype, "comparePassword");

describe("login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw HTTPError if user is not found", async () => {
    const email = "nonexistent@example.com";
    const password = "newPassword";
    const expectedError = new HTTPError({
      name: "InvalidCredentialsError",
      msg: "Invalid email or password.",
      code: 400,
    });

    UserModel.findOne.mockImplementationOnce(() => ({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }));

    await expect(login({ email, password })).rejects.toThrowError(expectedError);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: new RegExp(`^${email}$`, "i"),
    });
    expect(UserModel.prototype.comparePassword).not.toHaveBeenCalled();
  });

  test("should throw HTTPError if password does not match", async () => {
    const foundUser = {
      _id: "userId",
      comparePassword: jest.fn().mockResolvedValue(false),
    };
    const email = "existing@example.com";
    const password = "wrongPassword";
    const expectedError = new HTTPError({
      name: "InvalidCredentialsError",
      msg: "Invalid email or password.",
      code: 400,
    });

    UserModel.findOne.mockImplementationOnce(() => ({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(foundUser),
    }));

    await expect(login({ email, password })).rejects.toThrowError(expectedError);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: new RegExp(`^${email}$`, "i"),
    });
    expect(foundUser.comparePassword).toHaveBeenCalledWith(password);
  });
});