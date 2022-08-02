import { Query, Resolver } from "type-graphql";
import UserModel, { User } from "../../models/UserModel";

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  async users() {
    const users = await UserModel.find();
    return users;
  }
}
