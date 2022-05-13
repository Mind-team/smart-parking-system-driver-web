import React, { useEffect, useState } from "react";
import { RulesComponent } from "../../../components";
import classes from "./Home.styles.module.css";
import { LoginResponseDto, useDriverApi } from "../../../hooks/api/driver";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import { IDriver, IParkingProcess } from "../../../hooks/model/models";
import { InfoWidget, ParkingWidget, Loader, ErrorBanner } from "sps-ui";
import { useLocationState } from "../../../hooks/location";

export const HomePage = () => {
  const modelFactory = useModelFactory();
  const [userData, setUserData] = useState<IDriver>();
  const [lastParkingProcess, setLastParkingProcess] =
    useState<IParkingProcess>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const driverApi = useDriverApi();
  const [locationState] = useLocationState<LoginResponseDto>();

  const getParkingProcess = (id: string | "current") => {
    driverApi
      .parkingProcess(id)
      .then((response) => {
        if ("isEmptyResponse" in response || "error" in response) {
          throw new Error();
        }
        const model = modelFactory<IParkingProcess>(
          ModelToken.ParkingProcess,
          Array.isArray(response) ? response[0] : response,
        );
        setLastParkingProcess(model);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    const userData: LoginResponseDto = locationState;
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
    }
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
      {isError && <div>Какие-то проблемы</div>}
      <div className={classes.rulesWrapper}>
        <RulesComponent />
      </div>
      <div className={classes.widgetsWrapper}>
        {lastParkingProcess && lastParkingProcess.isCompleted && (
          <ParkingWidget
            id={lastParkingProcess.id}
            onClick={() => {}}
            size={"mini"}
            parkingName={lastParkingProcess.parking.title}
            date={lastParkingProcess.time.entry}
            price={lastParkingProcess.payment?.value.toFixed(2) as string}
          />
        )}
        {lastParkingProcess && !lastParkingProcess.isCompleted && (
          <ParkingWidget
            id={lastParkingProcess.id}
            onClick={() => {}}
            size={"mini"}
            price={lastParkingProcess.payment?.value.toFixed(2) as string}
          />
        )}
        {!lastParkingProcess && !isError && <div>У вас еще нет паркингов</div>}
        {!isError && userData && (
          <div className={classes.miniWidgetsWrapper}>
            <InfoWidget
              size="mini"
              leftSideText="Ваша карта:"
              rightSideText="8480"
            />
            <InfoWidget
              size="mini"
              leftSideText="Ваш номер:"
              rightSideText={
                userData.transportPlates.length
                  ? userData.transportPlates[0]
                  : ":("
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
