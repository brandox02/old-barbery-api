import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Haircut from "../../entities/Haircut";
import { Arg } from "type-graphql";
import { HaircutInput } from "./inputDef";
import { ICtx } from "../../types";
import { removeNullFields } from "../../utils";
import { uploadImage } from "../../fileService";
import { EntitySchema } from "typeorm";
import { UploadApiResponse } from "cloudinary";

const F = (fn: any) => {
  return () => {};
};

@Resolver()
export default class HaircutResolver {
  @Query(() => [Haircut])
  async haircuts(
    @Arg("where", { nullable: true }) where: HaircutInput,
    @Ctx() ctx: ICtx
  ) {
    let whereEnabled = { ...where, enabled: true };

    const haircuts = await ctx.appDataSource.getRepository(Haircut).find({
      where: removeNullFields<Haircut>(whereEnabled),
      order: {
        name: "ASC",
      },
    });
    return haircuts;
  }

  @Query(() => Haircut, { nullable: true })
  async haircut(@Arg("where") where: HaircutInput, @Ctx() ctx: ICtx) {
    where.enabled = true;
    const haircut = await ctx.appDataSource.getRepository(Haircut).findOne({
      where: removeNullFields<Haircut>(where),
      order: {
        name: "ASC",
      },
    });

    return haircut;
  }

  @Mutation(() => Haircut, {
    description:
      "create or update depending if send _id or not, if is create you need to send all entity fields without a _id, if is update just is obligatory send the _id field",
  })
  async saveHaircut(@Arg("haircut") haircut: HaircutInput, @Ctx() ctx: ICtx) {
    const haircutRepo = ctx.appDataSource.getRepository(Haircut);

    const payload = await uploadImage(haircutRepo, haircut);

    let haircutSaved = await haircutRepo.save(haircutRepo.create(payload));
    if (!haircutSaved) throw new Error("Haircut could not saved correctly");

    return haircutRepo.findOne({ where: { id: haircutSaved.id } });
  }
}
