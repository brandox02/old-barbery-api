import { isNil, omit, omitBy } from "lodash";
import { EntityManager } from "typeorm";
import { appDataSource } from "../initDBConnection";

export const removeNullFields = <T>(obj: any): Partial<T> => omitBy(obj, isNil);

export const withTransaction = async (fn: Function) => {
  return async (...args: any) => {
    if (!appDataSource) throw new Error("App Data Source does not inicialized");
    const response = await appDataSource.transaction(
      async (txn: EntityManager) => {
        return await fn(txn, ...args);
      }
    );
    return response;
  };
};

// merge the default and custom where for createQueryBuilder's
export const buildWhere = (
  alias: string,
  where: any,
  customWhere?: { query: string; field: string; value: any }[]
): [string, any] => {
  where = omit(
    where,
    customWhere && customWhere.length ? customWhere.map((x) => x.field) : []
  );
  let computed = Object.keys(where)
    .map((curr) => `${alias}.${curr} = :${curr}`)
    .join(" AND ");

  if (customWhere && customWhere.length) {
    customWhere.forEach((item, index) => {
      if (index === 0) {
        if (Object.keys(where).length) {
          computed += " AND ";
        }
      } else {
        computed += " AND ";
      }

      computed += item.query;
    });
  }

  const customWhereKeysValues =
    customWhere && customWhere.length
      ? customWhere.reduce(
          (acc, curr) => ({ ...acc, [curr.field]: curr.value }),
          {}
        )
      : {};

  return [
    computed,
    {
      ...where,
      ...customWhereKeysValues,
    },
  ];
};
