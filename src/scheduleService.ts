import dayjs from "dayjs";
import { ICtx } from "./types";
export const getScheduleInDate = async (
  ctx: ICtx,
  scheduleDate: Date,
  haircutDuration: string,
  include: boolean = false
) => {
  const formatDateTime = (datetime: Date) =>
    dayjs(datetime).format("DD-MM-YYYY HH:mm");

  return await ctx.appDataSource.query(
    `select * from schedules 
     left join haircuts on haircuts.id = schedules.haircut_id
     where 
     schedules.schedule_date between '${formatDateTime(
       scheduleDate
     )}' and '${formatDateTime(
      scheduleDate
    )}'::timestamp + interval '${haircutDuration}' or
     schedules.schedule_date + CAST(haircuts.duration AS Interval) between '${formatDateTime(
       scheduleDate
     )}' and '${formatDateTime(
      scheduleDate
    )}'::timestamp + interval '${haircutDuration}'
     `
  );
};
