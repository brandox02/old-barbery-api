import { Repository } from "typeorm";
import Haircut from "../../entities/Haircut";
import Schedule from "../../entities/Schedule";
import { ICtx } from "../../types";
import { ScheduleInput } from "./inputDef";

export const saveScheduleValidations = async (
  schedule: ScheduleInput,
  ctx: ICtx,
  scheduleRepo: Repository<Schedule>
) => {
  console.log({ schedule });
  const isCreate = !("id" in schedule);
  const willUpdateScheduleDate = "scheduleDate" in schedule;

  if (isCreate) {
    const haircut = await ctx.appDataSource
      .getRepository(Haircut)
      .findOne({ where: { id: schedule.haircutId } });

    if (!haircut) throw new Error("**No existe este corte de pelo");

    const existsWithEqualDate = Boolean(
      await scheduleRepo.findOne({
        where: { scheduleDate: schedule.scheduleDate },
      })
    );

    if (existsWithEqualDate) {
      throw new Error("**Ya hay una cita con esta misma fecha de agendación");
    }

    const haircutDuration = haircut.duration;

    const exitsScheduleInProcess = await ctx.appDataSource.query(
      `select * from schedules where 
      schedule_date between '2022-08-18 08:00:00' and '2022-08-18 08:00:00'::timestamp + interval '00:10:00' or
      schedule_date + interval '00:10:00' between '2022-08-18 08:00:00' and '2022-08-18 08:00:00'::timestamp + interval '00:10:00'
      `
    );

    if (false) {
      throw new Error("**Para esta fecha va a haber una cita en proceso");
    }

    console.log({ exitsScheduleInProcess });

    if (exitsScheduleInProcess) throw new Error("");
  } else if (willUpdateScheduleDate) {
    throw new Error("**No puedes cambiarle la fecha de agenda a una cita");
  }
};
