import jwt from "jsonwebtoken";
import UserModel, { User } from "../models/UserModel";

const secretToken = "REAL_SECRET_TOKEN";

function generateAccesToken(user: User): string {
  const token = jwt.sign(JSON.stringify(user), secretToken, {});
  return token;
}

export async function signIn(user: User): Promise<string> {
  const { username, email } = user;
  const found = await UserModel.findOne({ $or: [{ username }, { email }] });

  if (found) {
    throw new Error("This user already exists");
  }

  await new UserModel(user).save();
  const token = generateAccesToken(user);

  return token;
}

export async function logInByCredentials(
  username: string | undefined,
  password: string | undefined,
  email: string | undefined
): Promise<string> {
  const userFound = await UserModel.findOne({
    $or: [
      { username, password },
      { email, password },
    ],
  });
  
  if (!userFound) {
    throw new Error("This credentials are not correct");
  }
  
  const token = generateAccesToken(userFound);

  return token;
}

export function logInByToken(token: string): boolean {
  try {
    jwt.verify(token, secretToken);
    return true;
  } catch (e) {
    return false;
  }
}
