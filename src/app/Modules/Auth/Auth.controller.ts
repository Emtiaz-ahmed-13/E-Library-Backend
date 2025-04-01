import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import Config from "../../Config";
import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { AuthServices } from "./Auth.services";

const LoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.Login(req.body);
  const payload = { id: result?._id, role: result?.role, email: result?.email };
  const accessToken = jwt.sign(payload, Config.jwt_secret_key as string, {
    expiresIn: Config.jwt_expires_in,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1209600,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: { accessToken },
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.updatePasswordInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully",
    data: result,
  });
});

export const AuthControllers = { LoginUser, updatePassword };
