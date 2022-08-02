import { model, now, Schema } from "mongoose";
import HaircutModel, { IHaircut } from "./HaircutModel";
import UserModel, { User } from "./UserModel";

interface ISchedule {
  user: User;
  date: Date;
  haircut: IHaircut;
}

const ScheduleModel = model(
  "schedules",
  new Schema({
    user: { type: UserModel.schema, required: true },
    date: { type: Date, defaultValue: now(), required: false },
    haircut: { type: HaircutModel.schema, required: true },
  })
);

export default ScheduleModel;
