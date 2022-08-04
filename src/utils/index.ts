import { isNil, omitBy } from "lodash";

export const removeNullFields = <T>(obj: any): Partial<T> => omitBy(obj, isNil);
