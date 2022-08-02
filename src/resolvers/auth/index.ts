import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { logInByCredentials, signIn } from "../../services/auth";
import { LoginInput, SignInByCredentialInput } from "./inputDefs";
import { LoginOutput, SignInByCredentialOutput } from "./OutputDefs";

@Resolver()
export default class AuthResolver {
  @Query(() => Boolean)
  test() {
    console.log("something");
    return false;
  }

  @Mutation(() => LoginOutput, {
    description: "this is a resolver to login in the app",
  })
  async logIn(@Arg("user") userInput: LoginInput) {
    const token = await signIn(userInput);
    return { token };
  }

  @Mutation(() => SignInByCredentialOutput)
  async signInByCredentials(
    @Arg("credentials") credentials: SignInByCredentialInput
  ) {
    const { email, password, username } = credentials;
    const token = logInByCredentials(username, password, email);
    return { token };
  }
}
