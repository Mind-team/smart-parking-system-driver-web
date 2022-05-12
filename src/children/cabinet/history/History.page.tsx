import React, { useEffect } from "react";
import { useDriverApi } from "../../../hooks/api/driver";
import { useState } from "react";
import { IParkingProcess } from "../../../hooks/model/models";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import { ParkingWidget, Loader, ErrorBanner } from "sps-ui";
import classes from "./History.styles.module.css";
import { Sortbar } from "../../../components";
import { useNavigate } from "react-router-dom";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const factory = useModelFactory();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [parkingProcesses, setParkingProcesses] = useState<IParkingProcess[]>();
  const parameters = ["Время", "Стоимость"];

  const getParkingProcesses = () => {
    const api = useDriverApi();
    setLoading(true);
    api
      .parkingProcesses()
      .then((response) => {
        if ("isEmptyResponse" in response || "error" in response) {
          throw new Error();
        }
        const models = response.map((el) => {
          return factory<IParkingProcess>(ModelToken.ParkingProcess, el);
        });
        setParkingProcesses(models);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  const generateParameters = () => {
    // prettier-ignore
    return Array.isArray(parkingProcesses) && parkingProcesses.length > 0
      ? [
        ...parameters,
        parkingProcesses[parkingProcesses.length - 1].transport.plate,
      ]
      : parameters;
  };

  const handleFilterClick = (parameter: string) => {
    console.log(parameter);
  };

  const handleClickOnParkingProcess = (id: string | number) => {
    navigate(`/cabinet/history/${id}`, {
      state: parkingProcesses?.find((pp) => pp.id === id),
    });
  };

  useEffect(() => {
    getParkingProcesses();
  }, []);

  if (isLoading) {
    return (
      <div className={classes.wrapper}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={classes.wrapper}>
        <ErrorBanner size="m" />
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.padding}>
        <Sortbar parameters={generateParameters()} click={handleFilterClick} />
      </div>
      {parkingProcesses?.map((pp, key) => (
        <ParkingWidget
          id={pp.id}
          size={"long"}
          parkingName={pp.parking.title}
          date={pp.time.entry}
          price={pp.payment?.value.toFixed(2) as string}
          onClick={handleClickOnParkingProcess}
          key={key}
        />
      ))}
    </div>
  );
};