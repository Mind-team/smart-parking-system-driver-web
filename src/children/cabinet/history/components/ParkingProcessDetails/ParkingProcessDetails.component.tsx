import React from "react";
import { ErrorBanner, useFormatter } from "sps-ui";
import classes from "./ParkingProcessDetails.styles.module.css";
import { IParkingProcess } from "../../../../../hooks/model/models";
import { useLocationState } from "../../../../../hooks/location";

export const ParkingProcessDetails = () => {
  const [data] = useLocationState<IParkingProcess>();
  const formatter = useFormatter();

  if (!data) {
    return <ErrorBanner size="m" />;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.lineWrapper}>Паркинг: {data.parking.title}</div>
      <div className={classes.lineWrapper}>
        Дата въезда: {formatter("date", data.time.entry)}
      </div>
      <div className={classes.lineWrapper}>
        Дата выезда: {formatter("date", data.time.departure)}
      </div>
      <div className={classes.lineWrapper}>
        Время въезда: {formatter("time", data.time.entry)}
      </div>
      <div className={classes.lineWrapper}>
        Время выезда: {formatter("time", data.time.departure)}
      </div>
      <div className={classes.lineWrapper}>
        Номер транспорта: {data.transport.plate}
      </div>
    </div>
  );
};
