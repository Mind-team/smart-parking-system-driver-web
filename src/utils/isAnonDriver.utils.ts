import { IAnonDriver, IDriver } from "../hooks/model/models";

export const isAnonDriver = (driver: IDriver): driver is IAnonDriver => {
  return driver.isAnon;
};
