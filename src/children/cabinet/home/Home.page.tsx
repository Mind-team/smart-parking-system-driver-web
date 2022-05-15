import React, { useEffect } from "react";
import classes from "./Home.styles.module.css";
import { RulesComponent } from "../../../components";
import { LoginResponseDto, useDriverApi } from "../../../hooks/api/driver";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import { IDriver, IParkingProcess } from "../../../hooks/model/models";
import { useLocationState } from "../../../hooks/location";
import {
  InfoWidget,
  ParkingWidget,
  ErrorBanner,
  LoaderWrapper,
  useUpgradedState,
  useErrorCode,
} from "sps-ui";

export const HomePage = () => {
  const modelFactory = useModelFactory();
  const driverApi = useDriverApi();
  const {
    value: userData,
    setValue: setUserData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
  } = useUpgradedState<IDriver>();
  const {
    value: lastParkingProcess,
    setValue: setLastParkingProcess,
    isLoading: isParkingProcessLoading,
    setLoading: setParkingProcessLoading,
    isError: isLastParkingProcessError,
  } = useUpgradedState<IParkingProcess>();
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
      })
      .catch(() => {
        setLastParkingProcess(useErrorCode());
      });
  };

  useEffect(() => {
    const userData: LoginResponseDto = locationState;
    if (!userData) {
      driverApi
        .data()
        .then((response) => {
          if ("isEmptyResponse" in response || "error" in response) {
            throw new Error();
          }

          setUserData(modelFactory(ModelToken.Driver, response));

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
          setUserData(useErrorCode());
          setLastParkingProcess(useErrorCode());
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
        setParkingProcessLoading(false);
      }
    }
  }, []);

  if (isUserDataError || isLastParkingProcessError) {
    return (
      <div className={`${classes.wrapper} ${classes.alignItemsCenter}`}>
        <ErrorBanner size="m" />
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
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
        {!isParkingProcessLoading && !lastParkingProcess && (
          <div>У вас еще нет паркингов</div>
        )}
        <LoaderWrapper
          isLoading={isUserDataLoading}
          elementSizes={{ widthCss: "434px", heightCss: "302px" }}
        >
          {userData && (
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
