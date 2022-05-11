import React, { useState } from "react";
import { LoginPage } from "./Login.page";
import { useAuthApi } from "../../../../hooks/api/auth";
import { useDriverApi } from "../../../../hooks/api/driver";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../../../hooks/storage";
import { StorageToken } from "../../../../hooks/storage/storageToken.enum";

export const LoginContainer = () => {
  const navigate = useNavigate();
  const [authApi, driverApi] = [useAuthApi(), useDriverApi()];
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [isSmsSent, setSmsSent] = useState(false);
  const [isError, setError] = useState(false);

  const sendSMS = () => {
    authApi
      .sendCode({ method: "SMS", target: phoneNumberValue })
      .then(() => setSmsSent(true))
      .catch(() => setError(true));
  };

  const checkSMSCode = () => {
    driverApi
      .login({ phone: phoneNumberValue, confirmationCode: smsCode })
      .then((response) => {
        if ("isEmptyResponse" in response || "error" in response) {
          throw new Error("Empty");
        }
        const { write } = useStorage();
        write(StorageToken.AccessToken, response.accessToken);
        write(StorageToken.RefreshToken, response.refreshToken);

        navigate("/cabinet/home", { state: response });
      })
      .catch(() => setError(true));
  };

  return (
    <LoginPage
      smsCodeValueChanges={setSmsCode}
      isShowCodeField={isSmsSent}
      phoneNumberValueChanges={setPhoneNumberValue}
      onSendCodeButtonClick={sendSMS}
      onSendSmsCodeButtonClick={checkSMSCode}
      isError={isError}
    />
  );
};
