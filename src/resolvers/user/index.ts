import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import User from "../../entities/User";
import { Arg } from "type-graphql";
import { UserInput } from "./inputDef";
import { ICtx } from "../../types";
import { removeNullFields } from "../../utils";
import { logInByCredentials } from "../../authService";

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: ICtx) {
    const users = await ctx.appDataSource.getRepository(User).find();
    return users;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("where") where: UserInput, @Ctx() ctx: ICtx) {
    const user = await ctx.appDataSource
      .getRepository(User)
      .findOne({ where: removeNullFields<User>(where) });

    return user;
  }

  @Mutation(() => String, {
    description:
      "create or update depending if send id or not, if is create you need to send all entity fields without a id, if is update just is obligatory send the _id field",
  })
  async saveUser(@Arg("user") user: UserInput, @Ctx() ctx: ICtx) {
    const userRepo = ctx.appDataSource.getRepository(User);

    const userSaved = await userRepo.save(userRepo.create(user));

    const token = await logInByCredentials(
      userSaved.username,
      userSaved.password,
      userSaved.email
    );

    return token;
  }
}
