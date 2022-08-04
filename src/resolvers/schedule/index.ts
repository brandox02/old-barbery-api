import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Schedule from "../../entities/Schedule";
import { Arg } from "type-graphql";
import { ScheduleInput } from "./inputDef";
import { ICtx } from "../../types";
import { removeNullFields } from "../../utils";
import Haircut from "../../entities/Haircut";
import { saveScheduleValidations } from "./validations";

@Resolver()
export default class ScheduleResolver {
  @Query(() => [Schedule])
  async schedules(
    @Arg("where", { nullable: true }) where: ScheduleInput,
    @Ctx() ctx: ICtx
  ) {
    const schedules = await ctx.appDataSource.getRepository(Schedule).find({
      where: removeNullFields<Schedule>(where),
      relations: ["user", "haircut"],
    });
    return schedules;
  }

  @Query(() => Schedule, { nullable: true })
  async schedule(@Arg("where") where: ScheduleInput, @Ctx() ctx: ICtx) {
    const schedule = await ctx.appDataSource.getRepository(Schedule).findOne({
      where: removeNullFields<Schedule>(where),
      relations: ["user", "haircut"],
    });

    return schedule;
  }

  @Mutation(() => Schedule, {
    description:
      "create or update depending if send _id or not, if is create you need to send all entity fields without a _id, if is update just is obligatory send the _id field",
  })
  async saveSchedule(
    @Arg("schedule") schedule: ScheduleInput,
    @Ctx() ctx: ICtx
  ) {
    const scheduleRepo = ctx.appDataSource.getRepository(Schedule);
    
    await saveScheduleValidations(schedule, ctx, scheduleRepo);

    const scheduleSaved = await scheduleRepo.save(
      scheduleRepo.create(schedule)
    );

    return await scheduleRepo.findOne({
      where: { id: scheduleSaved.id },
      relations: ["user", "haircut"],
    });
  }
}
