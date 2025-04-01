import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import Config from "../Config";
import CustomError from "../Errors/AppError";
import { User } from "../Modules/User/User.model";
import catchAsync from "../Utils/catchAsync";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const decodedData = jwt.verify(
      token,
      Config.jwt_secret_key as string
    ) as JwtPayload;
    const { email, iat, role } = decodedData;
    req.user = decodedData;
    const existUser = await User.findOne({
      email,
    });
    if (!existUser) {
      throw new CustomError(httpStatus.NOT_FOUND, "User not found");
    }
    if (existUser?.passwordChangeAt && iat) {
      const passwordChangeAt = Math.floor(
        new Date(existUser?.passwordChangeAt).getTime() / 1000
      );

      const checkJwtIssuedBeforeLastPasswordChange = passwordChangeAt > iat;
      if (checkJwtIssuedBeforeLastPasswordChange) {
        throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
    }
    if (roles.length && !roles.includes(role)) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    next();
  });
};

export default auth;
