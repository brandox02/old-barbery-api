import { Arg, Mutation, Query, Resolver } from "type-graphql";
import {
  getUserByToken,
  logInByCredentials,
  logInByToken,
  signIn,
} from "../../authService";
import { LogInByCredentialInput, SignInInput } from "./inputDefs";
import {
  LogInByCredentialOutput,
  LogInByTokenOutput,
  SignInOutput,
} from "./outputDefs";

@Resolver()
export default class AuthResolver {
  @Mutation(() => SignInOutput, {
    description:
      "For sign in you need to provide a non existing user for can save it and return a token",
  })
  async signIn(@Arg("user") userInput: SignInInput) {
    const token = await signIn(userInput);

    return { token };
  }

  @Mutation(() => LogInByCredentialOutput, {
    description: "You need to provide a valid credentials for log into the app",
  })
  async logInByCredential(
    @Arg("credentials") credentials: LogInByCredentialInput
  ) {
    const { password, username } = credentials;
    const token = await logInByCredentials(username, password, username);
    return { token };
  }

  @Mutation(() => LogInByTokenOutput, {
    description: "verify if the token provided is valid for can log in",
  })
  async logInByToken(@Arg("token") token: string) {
    const isSuccefullyLoggin = logInByToken(token);
    if (isSuccefullyLoggin) {
      const user = getUserByToken(token);
      return { user };
    }
    return {
      user: null,
    };
  }
}
