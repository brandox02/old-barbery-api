import dayjs, { Dayjs } from "dayjs";
import dotenv from "dotenv";

dotenv.config();

enum Types {
  "SUBSTRACT",
  "ADD",
}

export const adjustDate = (dateInput: Date, type: Types): Date => {
  const hourOfDifference: number = parseInt(
    process.env.DIFF_HOURS_SERVER || ""
  );
  let date: Dayjs = dayjs(dateInput);

  if (type === Types.ADD) {
    date = date.add(hourOfDifference, "hours");
  } else {
    date = date.subtract(hourOfDifference, "hours");
  }

  return date.toDate();
};
