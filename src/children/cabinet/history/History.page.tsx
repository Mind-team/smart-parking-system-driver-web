import React, { useEffect } from "react";
import { useDriverApi } from "../../../hooks/api/driver";
import { IParkingProcess } from "../../../hooks/model/models";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import {
  ParkingWidget,
  ErrorBanner,
  useUpgradedState,
  useErrorCode,
  LoaderWrapper,
} from "sps-ui";
import classes from "./History.styles.module.css";
import { Sortbar } from "../../../components";
import { useNavigate } from "react-router-dom";

export const HistoryPage = () => {
  const navigate = useNavigate();
  const factory = useModelFactory();
  const parameters = ["Время", "Стоимость"];
  const {
    value: parkingProcesses,
    setValue: setParkingProcesses,
    isLoading: isParkingProcessesLoading,
    isError: isParkingProcessesError,
  } = useUpgradedState<IParkingProcess[]>([]);

  const getParkingProcesses = () => {
    const api = useDriverApi();
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
      })
      .catch(() => {
        setParkingProcesses(useErrorCode());
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

  if (isParkingProcessesError) {
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
      <LoaderWrapper isLoading={isParkingProcessesLoading}>
        {parkingProcesses?.map((pp, key) => (
          <div className={classes.paddingM} key={key}>
            <ParkingWidget
              id={pp.id}
              size={"long"}
              parkingName={pp.parking.title}
              date={pp.time.entry}
              price={pp.payment?.value.toFixed(2) as string}
              onClick={handleClickOnParkingProcess}
            />
          </div>
        ))}
      </LoaderWrapper>
    </div>
  );
};
