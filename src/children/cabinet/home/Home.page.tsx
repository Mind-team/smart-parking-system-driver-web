import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RulesComponent } from "../../../components";
import classes from "./Home.styles.module.css";
import { useDriverApi } from "../../../hooks/api/driver";
import { useModelFactory } from "../../../hooks/model/modelFactory.hook";
import { ModelToken } from "../../../hooks/model/modelToken.enum";
import { IParkingProcess } from "../../../hooks/model/models/parkingProcess.interface";
import { ParkingWidget } from "sps-ui";

export const HomePage = () => {
  const [lastParkingProcess, setLastParkingProcess] =
    useState<IParkingProcess>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const driverApi = useDriverApi();
  const location = useLocation();

  const getParkingProcess = (id: string | "current") => {
    driverApi
      .parkingProcess(id)
      .then((response) => {
        if ("isEmptyResponse" in response) {
          throw new Error();
        }
        if ("error" in response) {
          throw new Error();
        }
        const modelFactory = useModelFactory();
        const model = modelFactory<IParkingProcess>(
          ModelToken.ParkingProcess,
          response.parking,
        );
        setLastParkingProcess(model);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    // @ts-ignore
    const userData: {
      currentParkingProcessId: string | null;
      parkingProcessesIds: string[];
    } = location.state;
    if (!userData) {
      driverApi
        .data()
        .then((response) => {
          if ("isEmptyResponse" in response) {
            throw new Error();
          }
          if ("error" in response) {
            throw new Error();
          }

          const id = response.currentParkingProcessId
            ? "current"
            : [...response.parkingProcessesIds].pop();

          if (!id) {
            setLoading(false);
            return;
          }

          getParkingProcess(id);
        })
        .catch(() => {
          setLoading(false);
          setError(true);
        });
      return;
    } else {
      const id = userData.currentParkingProcessId
        ? "current"
        : [...userData.parkingProcessesIds].pop();

      if (id) {
        getParkingProcess(id);
      } else {
        setLoading(false);
      }

      // window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      {isError && <div>Какие-то проблемы</div>}
      <RulesComponent />
      {isLoading && <div>Загрузка ваших паркингов</div>}
      {lastParkingProcess && (
        <ParkingWidget
          size={"mini"}
          data={{
            parkingName: lastParkingProcess.parking.title as string,
            date: lastParkingProcess.time.entry as string,
            price: lastParkingProcess.payment?.value as number,
            detailsClick: () => {},
          }}
        />
      )}
      {!lastParkingProcess && !isError && <div>У вас еще нет паркингов</div>}
    </div>
  );
};
