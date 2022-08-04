import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { logInByCredentials, logInByToken, signIn } from "../../authService";
import { LogInByCredentialInput, SignInInput } from "./inputDefs";
import {
  LogInByCredentialOutput,
  SignInOutput,
} from "./outputDefs";

@Resolver()
export default class AuthResolver {
  @Query(() => Boolean)
  test() {
    console.log("something");
    return false;
  }

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
    const { email, password, username } = credentials;
    const token = await logInByCredentials(username, password, email);
    return { token };
  }

  @Mutation(() => Boolean, {description: 'verify if the token provided is valid for can log in'})
  async logInByToken(@Arg("token") token: string) {
    const isSuccefullyLoggin = logInByToken(token);
    return isSuccefullyLoggin;;
  }
}
