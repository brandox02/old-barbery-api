import dayjs from "dayjs";
import dotenv from "dotenv";

dotenv.config();
export const adjustDate = (dateInput: Date): Date => {
  const hourOfDifference: number = parseInt(
    process.env.DIFF_HOURS_SERVER || ""
  );

  const date = dayjs(dateInput).subtract(hourOfDifference, "hours").toDate();

  return date;
};
