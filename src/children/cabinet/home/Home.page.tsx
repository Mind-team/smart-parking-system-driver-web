import React, { useEffect, useState } from "react";
import { RulesComponent } from "../../../components";
import classes from "./Home.styles.module.css";
import { LoginResponseDto, useDriverApi } from "../../../hooks/api/driver";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import { IDriver, IParkingProcess } from "../../../hooks/model/models";
import { InfoWidget, ParkingWidget, ErrorBanner, LoaderWrapper } from "sps-ui";
import { useLocationState } from "../../../hooks/location";

export const HomePage = () => {
  const modelFactory = useModelFactory();
  const [userData, setUserData] = useState<IDriver>();
  const [lastParkingProcess, setLastParkingProcess] =
    useState<IParkingProcess>();
  const [isError, setError] = useState(false);
  const driverApi = useDriverApi();
  const [locationState] = useLocationState<LoginResponseDto>();
  const [isUserDataLoading, setUserDataLoading] = useState(true);
  const [isParkingProcessLoading, setParkingProcessLoading] = useState(true);

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
        setParkingProcessLoading(false);
      })
      .catch(() => {
        setParkingProcessLoading(false);
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
          setUserDataLoading(false);

          const id = response.currentParkingProcessesIds.length
            ? "current"
            : [...response.parkingProcessesIds].pop();

          if (!id) {
            setParkingProcessLoading(false);
            return;
          }

          getParkingProcess(id);
        })
        .catch(() => {
          setParkingProcessLoading(false);
          setUserDataLoading(false);
          setError(true);
        });
      return;
    } else {
      setUserData(modelFactory(ModelToken.Driver, userData));
      setUserDataLoading(false);
      const id = userData.currentParkingProcessesIds.length
        ? "current"
        : [...userData.parkingProcessesIds].pop();

      if (id) {
        getParkingProcess(id);
      } else {
        setParkingProcessLoading(false);
      }
    }
  }, []);

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
        <LoaderWrapper
          isLoading={isParkingProcessLoading}
          elementSizes={{ widthCss: "434px", heightCss: "302px" }}
        >
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
        </LoaderWrapper>
        {!isParkingProcessLoading && !lastParkingProcess && !isError && (
          <div>У вас еще нет паркингов</div>
        )}
        <LoaderWrapper
          isLoading={isUserDataLoading}
          elementSizes={{ widthCss: "434px", heightCss: "302px" }}
        >
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
        </LoaderWrapper>
      </div>
    </div>
  );
};
