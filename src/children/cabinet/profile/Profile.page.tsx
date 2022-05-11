import React, { useEffect, useState } from "react";
import { useLocationState } from "../../../hooks/location";
import { IDriver } from "../../../hooks/model/models";
import { isAnonDriver } from "../../../utils";
import { useDriverApi } from "../../../hooks/api/driver";
import { ModelToken, useModelFactory } from "../../../hooks/model/factory";
import classes from "./Profile.styles.module.css";

export const ProfilePage = () => {
  const modelFactory = useModelFactory();
  const [user, setUser] = useState<IDriver>();
  const [stateFromLocation] = useLocationState<IDriver>();
  const driverApi = useDriverApi();

  useEffect(() => {
    if (stateFromLocation) {
      setUser(stateFromLocation);
      return;
    }
    driverApi.data().then((response) => {
      if ("isEmptyResponse" in response || "error" in response) {
        throw new Error();
      }
      setUser(modelFactory(ModelToken.Driver, response));
    });
  }, []);

  if (!user) {
    return <div></div>;
  }

  if (isAnonDriver(user)) {
    return <div>:(</div>;
  }

  return (
    <div className={classes.wrapper}>
      <div>Номер телефон: {user.personData.phone}</div>
      {user.personData.email && (
        <div>Электронная почта: {user.personData.email}</div>
      )}
      {user.transportPlates.length > 1 && (
        <div>
          <span> Ваши транспортные номера:</span>
          {user.transportPlates.map((plate, key) => (
            <span key={key}>{plate}</span>
          ))}
        </div>
      )}
      {user.transportPlates.length === 1 && (
        <div>
          <span>Ваш транспортный номер:</span>
          <span>{user.transportPlates[0]}</span>
        </div>
      )}
    </div>
  );
};
