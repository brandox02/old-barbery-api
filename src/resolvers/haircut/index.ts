import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Haircut from "../../entities/Haircut";
import { Arg } from "type-graphql";
import { HaircutInput } from "./inputDef";
import { ICtx } from "../../types";
import { removeNullFields } from "../../utils";

@Resolver()
export default class HaircutResolver {
  @Query(() => [Haircut])
  async haircuts(
    @Arg("where", { nullable: true }) where: HaircutInput,
    @Ctx() ctx: ICtx
  ) {
    const haircuts = await ctx.appDataSource
      .getRepository(Haircut)
      .find({ where: removeNullFields<Haircut>(where) });
    return haircuts;
  }

  @Query(() => Haircut, { nullable: true })
  async haircut(@Arg("where") where: HaircutInput, @Ctx() ctx: ICtx) {
    const haircut = await ctx.appDataSource
      .getRepository(Haircut)
      .findOne({ where: removeNullFields<Haircut>(where) });

    return haircut;
  }

  @Mutation(() => Haircut, {
    description:
      "create or update depending if send _id or not, if is create you need to send all entity fields without a _id, if is update just is obligatory send the _id field",
  })
  async saveHaircut(@Arg("haircut") haircut: HaircutInput, @Ctx() ctx: ICtx) {
    const haircutRepo = ctx.appDataSource.getRepository(Haircut);

    const haircutSaved = await haircutRepo.save(haircutRepo.create(haircut));

    return await haircutRepo.findOne({ where: { id: haircutSaved.id } });
  }
}
