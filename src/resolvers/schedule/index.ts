import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import Schedule from "../../entities/Schedule";
import { Arg } from "type-graphql";
import { ScheduleInput, ScheduleWhereInput } from "./inputDef";
import { ICtx } from "../../types";
import { buildWhere, removeNullFields } from "../../utils";
import { saveScheduleValidations } from "./validations";
import { SchedulesPerDay } from "./outputDef";
import dayjs from "dayjs";

@Resolver()
export default class ScheduleResolver {
  @Query(() => [Schedule])
  async schedules(
    @Arg("where", { nullable: true }) where: ScheduleWhereInput,
    @Ctx() ctx: ICtx
  ) {
    const customWhere = [];

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
    const nonAvaibleIntervals = await ctx.appDataSource
      .query(`-- select the non-avaible intervals of the gived date
      select to_char(schedules.schedule_date, 'HH24:MI:SS') AS "start" ,
            to_char(schedules.schedule_date + CAST(haircuts.duration as Interval ), 'HH24:MI:SS') AS "end" 
            , 'non-avaible' as "type"
            from schedules 
            left join haircuts on haircuts.id = schedules.haircut_id
            where CAST(schedules.schedule_date AS Date) = '${where.date}'
      `);

    const nonWorkIntervals = await ctx.appDataSource.query(`
    --  select non-work intervals of the gived date
select nw.start, nw.end , 'non-work' as "type"
from non_work_hour_intervals nw  
left join work_schedule_days ws on nw.work_schedule_day_id = ws.id
where extract(isodow from date '${where.date}') = ws.id
`);

    return [...nonAvaibleIntervals, ...nonWorkIntervals];
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
