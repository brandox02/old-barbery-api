import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import WorkScheduleDay from "../../entities/WorkScheduleDay";
import { Arg } from "type-graphql";
import { WorkScheduleDayInput } from "./inputDef";
import { ICtx } from "../../types";
import { removeNullFields } from "../../utils";
import { In } from "typeorm";

@Resolver()
export default class WorkScheduleDayResolver {
  @Query(() => [WorkScheduleDay])
  async workScheduleDays(
    @Arg("where", { nullable: true }) where: WorkScheduleDayInput,
    @Ctx() ctx: ICtx
  ) {
    const workScheduleDays = await ctx.appDataSource
      .getRepository(WorkScheduleDay)
      .find({
        where: removeNullFields<WorkScheduleDay>(where),
        relations: {
          nonWorkIntervals: true,
        },
      });
    return workScheduleDays;
  }

  @Query(() => WorkScheduleDay, { nullable: true })
  async workScheduleDay(
    @Arg("where") where: WorkScheduleDayInput,
    @Ctx() ctx: ICtx
  ) {
    const workScheduleDay = await ctx.appDataSource
      .getRepository(WorkScheduleDay)
      .findOne({
        where: removeNullFields<WorkScheduleDay>(where),
        relations: {
          nonWorkIntervals: true,
        },
      });

    return workScheduleDay;
  }

  @Mutation(() => WorkScheduleDay, {
    description:
      "create or update depending if send _id or not, if is create you need to send all entity fields without a _id, if is update just is obligatory send the _id field",
    nullable: true,
  })
  async saveWorkScheduleDay(
    @Arg("workScheduleDay") workScheduleDay: WorkScheduleDayInput,
    @Ctx() ctx: ICtx
  ) {
    return await ctx.appDataSource.transaction(async (txn) => {
      const workScheduleDayRepo = txn.getRepository(WorkScheduleDay);

      const workScheduleDaySaved = await workScheduleDayRepo.save(
        workScheduleDayRepo.create(workScheduleDay)
      );

      return await workScheduleDayRepo.findOne({
        where: { id: workScheduleDaySaved.id },
        relations: {
          nonWorkIntervals: true,
        },
      });
    });
  }

  @Mutation(() => [WorkScheduleDay], {
    description:
      "create or update multiple depending if send _id or not, if is create you need to send all entity fields without a _id, if is update just is obligatory send the _id field",
    nullable: true,
  })
  async saveWorkScheduleDays(
    @Arg("workScheduleDays", () => [WorkScheduleDayInput])
    workScheduleDays: WorkScheduleDayInput[],
    @Ctx() ctx: ICtx
  ) {
    return await ctx.appDataSource.transaction(async (txn) => {
      const workScheduleDayRepo = txn.getRepository(WorkScheduleDay);

      await workScheduleDayRepo.save(
        workScheduleDayRepo.create(workScheduleDays)
      );

      return await workScheduleDayRepo.find({
        where: { id: In(workScheduleDays.map((x) => x.id)) },
        relations: {
          nonWorkIntervals: true,
        },
      });
    });
  }
}
