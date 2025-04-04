import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import Config from "../../Config";
import CustomError from "../../Errors/AppError";
import { User } from "../User/User.model";

const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new CustomError(
      httpStatus.NOT_FOUND,
      `User not found with email ${email}`
    );
  }
  const isPasswordMatched = bcrypt.compareSync(password, userExist.password);
  if (!isPasswordMatched) {
    throw new CustomError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  return userExist;
};

const updatePasswordInDB = async (payload: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const { email, oldPassword, newPassword } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(httpStatus.NOT_FOUND, "User not found");
  }
  const isPasswordMatched = bcrypt.compareSync(oldPassword, user.password);
  console.log("from line 43", isPasswordMatched);
  if (!isPasswordMatched) {
    throw new CustomError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  const hashedNewPassword = bcrypt.hashSync(
    newPassword,
    Number(Config.bcrypt_salt_rounds)
  );
  user.password = hashedNewPassword;
  const result = await user.save();
  return result;
};

export const AuthServices = { Login, updatePasswordInDB };
