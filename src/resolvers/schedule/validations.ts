import dayjs from "dayjs";
import { Repository } from "typeorm";
import Haircut from "../../entities/Haircut";
import Schedule from "../../entities/Schedule";
import { getScheduleInDate } from "../../scheduleService";
import { ICtx } from "../../types";
import { ScheduleInput } from "./inputDef";

export const saveScheduleValidations = async (
  schedule: ScheduleInput,
  ctx: ICtx
) => {
  const isCreate = !("id" in schedule);
  const willUpdateScheduleDate = "scheduleDate" in schedule;

  if (isCreate) {
    const haircut = await ctx.appDataSource
      .getRepository(Haircut)
      .findOne({ where: { id: schedule.haircutId } });

    if (!haircut) throw new Error("**No existe este corte de pelo");

    const exitsScheduleInProcess = await getScheduleInDate(
      ctx,
      schedule.scheduleDate,
      haircut.duration
    );

    if (exitsScheduleInProcess.length) {
      const formattedDate = dayjs(
        exitsScheduleInProcess[0]["schedule_date"]
      ).format("DD-MM-YYYY");

      const formattedDuration = dayjs(
        `01-01-0000 ${exitsScheduleInProcess[0]["duration"]}`
      ).format("HH:mm");

      const formattedTime = dayjs(
        exitsScheduleInProcess[0]["schedule_date"]
      ).format("HH:mm");
      throw new Error(
        `**Esta fecha choca con una agenda del ${formattedDate} que empieza a las ${formattedTime} y tiene una duración de ${formattedDuration}`
      );
    }
  } else if (willUpdateScheduleDate) {
    throw new Error("**No puedes cambiarle la fecha de agenda a una cita");
  }
};
