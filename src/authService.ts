import jwt from "jsonwebtoken";
import User from "./entities/User";
import dotenv from "dotenv";
import { appDataSource } from "./initDBConnection";
import { SignInInput } from "./resolvers/auth/inputDefs";
dotenv.config();

const secretToken: string = process.env.JWT_SECRET_TOKEN as string;

function generateAccesToken(user: SignInInput): string {
  const token = jwt.sign(JSON.stringify(user), secretToken, {});
  return token;
}

export async function signIn(user: SignInInput): Promise<string> {
  if (!appDataSource) {
    throw new Error("appDataSource is not defined!");
  }
  const userRepo = appDataSource.getRepository(User);

  const { username, email } = user;
  const found = await userRepo.findOne({ where: [{ username }, { email }] });
  if (found) {
    throw new Error("This user already exists");
  }

  const userSaved = await userRepo.save(userRepo.create(user));

  const token = generateAccesToken(userSaved);

  return token;
}

export async function logInByCredentials(
  username: string | undefined,
  password: string | undefined,
  email: string | undefined
): Promise<string> {
  if (!appDataSource) {
    throw new Error("appDataSource is not defined!");
  }
  const userRepo = appDataSource.getRepository(User);

  const userFound = await userRepo
    .createQueryBuilder("user")
    .select("user")
    .where(
      "(user.email = :email or user.username = :username) and user.password = :password",
      { email, username, password }
    )
    .getOne();

  if (!userFound) {
    throw new Error("Credenciales incorrectas");
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

export const getUserByToken = (token: string) => jwt.decode(token);
