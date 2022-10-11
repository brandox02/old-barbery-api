import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Schedule from "../../entities/Schedule";
import { Arg } from "type-graphql";
import { ScheduleInput, ScheduleWhereInput } from "./inputDef";
import { ICtx } from "../../types";
import { buildWhere, removeNullFields } from "../../utils";
import { GetAvalibleIntervals, SchedulesPerDay } from "./outputDef";
import { isChoken } from "../../utils/isChoken";
import {
  getAvalibleIntervals,
  getBusyDates,
  GetValibleInterval,
} from "../../scheduleService";

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
    // type IWorkIntervals = Array<{ start: string; end: string; type: string }>;
    // function buildNonWorkIntervals(workIntervals: IWorkIntervals) {
    //   const areContinues = (arg0: string, arg1: string) => {
    //     const num0 = parseInt(arg0.substring(0, 2));
    //     const num1 = parseInt(arg1.substring(0, 2));
    //     return num0 + 1 == num1 || num1 + 1 === num0;
    //   };
    //   const nonWorkIntervals = [...Array(24)]
    //     .map(
    //       (_, i) =>
    //         `${
    //           i.toString().length === 1 ? `0${i.toString()}` : i.toString()
    //         }:00:00`
    //     )
    //     .filter((x) =>
    //       workIntervals.every(
    //         (y: any) =>
    //           !isChoken({
    //             time: x,
    //             duration: "00:00:00",
    //             startTime: y.start,
    //             endTime: y.end,
    //           })
    //       )
    //     )
    //     .reduce((acc: IWorkIntervals, curr: string) => {
    //       const blankTemplate = { start: curr, end: curr, type: "non-work" };
    //       if (!acc.length) {
    //         return [...acc, blankTemplate];
    //       }
    //       if (areContinues(curr, acc[acc.length - 1].end)) {
    //         const newArr = [...acc];
    //         newArr[newArr.length - 1] = {
    //           start: newArr[newArr.length - 1].start,
    //           end: curr,
    //           type: "non-work",
    //         };
    //         return newArr;
    //       }
    //       return [...acc, blankTemplate];
    //     }, []);
    //   return nonWorkIntervals;
    // }
    // const workIntervals = await ctx.appDataSource.query(`
    // --  select non-work intervals of the gived date
    // select nw.start, nw.end , 'non-work' as "type"
    // from work_hour_intervals nw
    // left join work_schedule_days ws on nw.work_schedule_day_id = ws.id
    // where extract(isodow from date '${where.date}') = ws.id
    // `);
    // const nonWorkIntervals = buildNonWorkIntervals(workIntervals);
    // const nonAvaibleIntervals = await ctx.appDataSource
    //   .query(`-- select the non-avaible intervals of the gived date
    //   select to_char(schedules.schedule_date, 'HH24:MI:SS') AS "start" ,
    //         to_char(schedules.schedule_date + CAST(haircuts.duration as Interval ), 'HH24:MI:SS') AS "end"
    //         , 'non-avaible' as "type"
    //         from schedules
    //         left join haircuts on haircuts.id = schedules.haircut_id
    //         where haircuts.enabled is true and CAST(schedules.schedule_date AS Date) = '${where.date}' and schedules.cancelled is false
    //   `);
    // const response = [...nonAvaibleIntervals, ...nonWorkIntervals];
    // return response;

    const response = await getBusyDates(ctx, where.date);
    return response;
  }

  @Query(() => [GetAvalibleIntervals])
  async getAvalibleIntervals(
    @Arg("duration") duration: string,
    @Arg("date") date: string,
    @Ctx() ctx: ICtx
  ): Promise<GetValibleInterval[]> {
    console.log({ duration, date });
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
