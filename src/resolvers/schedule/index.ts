import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Schedule from "../../entities/Schedule";
import { Arg } from "type-graphql";
import { ScheduleInput, ScheduleWhereInput } from "./inputDef";
import { ICtx } from "../../types";
import { buildWhere, removeNullFields } from "../../utils";
import { GetAvalibleIntervals, SchedulesPerDay } from "./outputDef";
import {
  getAvalibleIntervals,
  getBusyDates,
  GetValibleInterval,
} from "../../scheduleService";
import dayjs from "dayjs";

@Resolver()
export default class ScheduleResolver {
  @Query(() => [Schedule])
  async schedules(
    @Arg("where", { nullable: true }) where: ScheduleWhereInput,
    @Ctx() ctx: ICtx
  ) {
    interface CustomWhere {
      query: string;
      field: string;
      value: any;
    }

    const customWhere: CustomWhere[] = [
      {
        query: "schedule.cancelled = :cancelled",
        field: "cancelled",
        value: false,
      },
      {
        query: "haircut.enabled = :enabled",
        field: "enabled",
        value: true,
      },
    ];

    if (where.date) {
      customWhere.push({
        query: "CAST(schedule.schedule_date AS Date) = :date",
        field: "date",
        value: where.date,
      });
    } else if (where.dates) {
      customWhere.push({
        query: "CAST(schedule.schedule_date AS Date) IN(:...dates)",
        field: "dates",
        value: where.dates,
      });
    }

    const response = await ctx.appDataSource
      .createQueryBuilder(Schedule, "schedule")
      .leftJoinAndSelect("schedule.haircut", "haircut")
      .leftJoinAndSelect("schedule.user", "user")
      .where(...buildWhere("schedule", where, customWhere))
      .addOrderBy("haircut.name", "ASC")
      .getMany();

    return response;
  }

  @Query(() => Schedule, { nullable: true })
  async schedule(@Arg("where") where: ScheduleInput, @Ctx() ctx: ICtx) {
    where.cancelled = false;
    const schedule = await ctx.appDataSource.getRepository(Schedule).findOne({
      where: removeNullFields<Schedule>(where),
      relations: ["user", "haircut"],
    });

    return schedule;
  }

  @Query(() => [SchedulesPerDay])
  async schedulesPerDay(
    @Arg("where", { nullable: true }) where: ScheduleWhereInput,
    @Ctx() ctx: ICtx
  ) {
    const response = await getBusyDates(ctx, where.date);
    return response;
  }

  @Query(() => [GetAvalibleIntervals])
  async getAvalibleIntervals(
    @Arg("duration") duration: string,
    @Arg("date") date: Date,
    @Ctx() ctx: ICtx
  ): Promise<GetValibleInterval[]> {
    const busyDates = await getBusyDates(ctx, date);
    return getAvalibleIntervals(duration, busyDates);
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
    console.log(
      "schedule: ",
      dayjs(schedule.scheduleDate).format("DD-MM-YYYY hh:mm:ssA")
    );
    // await saveScheduleValidations(schedule, ctx);

    const scheduleSaved = await scheduleRepo.save(
      scheduleRepo.create(schedule)
    );

    return await scheduleRepo.findOne({
      where: { id: scheduleSaved.id },
      relations: ["user", "haircut"],
    });
  }
}
