import UserModel from "../../srcmodels/user.model.js";
import verify from "../../src/verify.js";
import { HTTPError } from "../../src/helpers/error.helper.js";

jest.mock("../models/user.model.js");

describe("verify", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw HTTPError if user is not found", async () => {
    const userId = "nonexistentId";
    const code = "verificationCode";

    UserModel.findById.mockResolvedValueOnce(null);

    await expect(verify({ userId, code })).rejects.toThrow(HTTPError);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  test("should throw HTTPError if user is already verified", async () => {
    const foundUser = {
      verified: true,
    };
    const userId = "existingId";
    const code = "verificationCode";

    UserModel.findById.mockResolvedValueOnce(foundUser);

    await expect(verify({ userId, code })).rejects.toThrow(HTTPError);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  test("should throw HTTPError if code is not found", async () => {
    const foundUser = {
      code: null,
    };
    const userId = "existingId";
    const code = "verificationCode";

    UserModel.findById.mockResolvedValueOnce(foundUser);

    await expect(verify({ userId, code })).rejects.toThrow(HTTPError);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
  });

  test("should throw HTTPError if code is invalid", async () => {
    const foundUser = {
      code: "correctCode",
      setVerified: jest.fn(),
    };
    const userId = "existingId";
    const code = "wrongCode";

    UserModel.findById.mockResolvedValueOnce(foundUser);

    await expect(verify({ userId, code })).rejects.toThrow(HTTPError);
    expect(UserModel.findById).toHaveBeenCalledWith(userId);
    expect(foundUser.setVerified).not.toHaveBeenCalled();
  });

  test("should verify user and return true", async () => {
    const foundUser = {
      code: "correctCode",
      setVerified: jest.fn(),
    };
    const userId = "existingId";
    const code = "correctCode";

    UserModel.findById.mockResolvedValueOnce(foundUser);

    const result = await verify({ userId, code });

    expect(UserModel.findById).toHaveBeenCalledWith(userId);
    expect(foundUser.setVerified).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
