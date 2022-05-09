import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RulesComponent } from "../../../components";
import classes from "./Home.styles.module.css";
import { LoginResponseDto, useDriverApi } from "../../../hooks/api/driver";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import { IDriver, IParkingProcess } from "../../../hooks/model/models";
import { InfoWidget, ParkingWidget } from "sps-ui";

export const HomePage = () => {
  const modelFactory = useModelFactory();
  const [userData, setUserData] = useState<IDriver>();
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
        const model = modelFactory<IParkingProcess>(
          ModelToken.ParkingProcess,
          Array.isArray(response) ? response[0] : response,
        );
        setLastParkingProcess(model);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    // @ts-ignore
    const userData: LoginResponseDto = location.state;
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

          setUserData(modelFactory(ModelToken.Driver, response));

          const id = response.currentParkingProcessesIds.length
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
      setUserData(modelFactory(ModelToken.Driver, userData));
      const id = userData.currentParkingProcessesIds.length
        ? "current"
        : [...userData.parkingProcessesIds].pop();

      if (id) {
        getParkingProcess(id);
      } else {
        setLoading(false);
      }

      window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      {isError && <div>Какие-то проблемы</div>}
      <div className={classes.rulesWrapper}>
        <RulesComponent />
      </div>
      {isLoading && <div>Загрузка ваших паркингов</div>}
      <div className={classes.widgetsWrapper}>
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
        {!isError && userData && (
          <div className={classes.miniWidgetsWrapper}>
            <InfoWidget
              size="mini"
              data={{ leftSideText: "Ваша карта:", rightSideText: "8480" }}
            />
            <InfoWidget
              size="mini"
              data={{
                leftSideText: "Ваш номер:",
                rightSideText: userData.transportPlates.length
                  ? userData.transportPlates[0]
                  : ":(",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
