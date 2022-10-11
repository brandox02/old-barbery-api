import dayjs from "dayjs";
import { SchedulesPerDay } from "./resolvers/schedule/outputDef";
import { ICtx } from "./types";
import { isChoken } from "./utils/isChoken";

export type GetValibleInterval = {
  start: Date;
  end: Date;
};
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
     haircuts.enabled is true and 
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

export const getBusyDates = async (
  ctx: ICtx,
  date: string
): Promise<SchedulesPerDay[]> => {
  type IWorkIntervals = { start: string; end: string; type: string }[];
  function buildNonWorkIntervals(workIntervals: IWorkIntervals) {
    const areContinues = (arg0: string, arg1: string) => {
      const num0 = parseInt(arg0.substring(0, 2));
      const num1 = parseInt(arg1.substring(0, 2));

      return num0 + 1 == num1 || num1 + 1 === num0;
    };

    const nonWorkIntervals = [...Array(24)]
      .map(
        (_, i) =>
          `${
            i.toString().length === 1 ? `0${i.toString()}` : i.toString()
          }:00:00`
      )
      .filter((x) =>
        workIntervals.every(
          (y: any) =>
            !isChoken({
              time: x,
              duration: "00:00:00",
              startTime: y.start,
              endTime: y.end,
            })
        )
      )
      .reduce((acc: IWorkIntervals, curr: string) => {
        const blankTemplate = { start: curr, end: curr, type: "non-work" };
        if (!acc.length) {
          return [...acc, blankTemplate];
        }
        if (areContinues(curr, acc[acc.length - 1].end)) {
          const newArr = [...acc];
          newArr[newArr.length - 1] = {
            start: newArr[newArr.length - 1].start,
            end: curr,
            type: "non-work",
          };
          return newArr;
        }

        return [...acc, blankTemplate];
      }, []);

    return nonWorkIntervals;
  }

  const workIntervals = await ctx.appDataSource.query(`
  --  select non-work intervals of the gived date
  select nw.start, nw.end , 'non-work' as "type"
  from work_hour_intervals nw  
  left join work_schedule_days ws on nw.work_schedule_day_id = ws.id
  where extract(isodow from date '${date}') = ws.id
  `);

  const nonWorkIntervals = buildNonWorkIntervals(workIntervals);

  const nonAvaibleIntervals = await ctx.appDataSource
    .query(`-- select the non-avaible intervals of the gived date
    select to_char(schedules.schedule_date, 'HH24:MI:SS') AS "start" ,
          to_char(schedules.schedule_date + CAST(haircuts.duration as Interval ), 'HH24:MI:SS') AS "end" 
          , 'non-avaible' as "type"
          from schedules 
          left join haircuts on haircuts.id = schedules.haircut_id
          where haircuts.enabled is true and CAST(schedules.schedule_date AS Date) = '${date}' and schedules.cancelled is false
    `);

  const response = [...nonAvaibleIntervals, ...nonWorkIntervals];
  return response;
};

export const getAvalibleIntervals = async (
  duration: string,
  busyDates: SchedulesPerDay[]
): Promise<GetValibleInterval[]> => {
  const timeToUnix = (time: string) => {
    const hours = parseInt(time.substring(0, 3));
    const minutes = parseInt(time.substring(3, 6));
    const seconds = parseInt(time.substring(6, 8));

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    const unixTime = date.getTime();

    return unixTime;
  };
  const generateIntervals = (time: string) => {
    const minutes =
      dayjs(timeToUnix(time)).get("minutes") +
      dayjs(timeToUnix(time)).get("hours") * 60;

    const totalMinutes24 = 24 * 60;
    const arr = [];
    for (let i = 0; i < totalMinutes24; i += minutes) {
      const item = {
        start: dayjs(timeToUnix("00:00:00")).add(i, "minutes"),
        end: dayjs(timeToUnix("00:00:00")).add(i + minutes, "minutes"),
      };
      if (item.end.get("hours") === 0 || item.start.get("hours") === 0) {
        continue;
      }
      arr.push(item);
    }
    return arr;
  };

  const response: GetValibleInterval[] = generateIntervals(duration)
    .filter(({ start }) => {
      const some = busyDates.some((schedule) =>
        isChoken({
          duration,
          time: start.format("HH:mm:ss"),
          endTime: schedule.end,
          startTime: schedule.start,
        })
      );

      return !some;
    })
    .map((item) => ({ start: item.start.toDate(), end: item.end.toDate() }));

  // console.log(
  //   response.map((item) => ({
  //     start: dayjs(item.start).format("hh-mm-ssA"),
  //     end: dayjs(item.end).format("hh-mm-ssA"),
  //   }))
  // );

  return response;
};
