import React, { useState } from "react";
import { LoginPage } from "./Login.page";
import { useAuthApi } from "../../../hooks/api/auth";
import { useDriverApi } from "../../../hooks/api/driver";
import { useNavigate } from "react-router-dom";

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
        if ("isEmptyResponse" in response) {
          throw new Error("Empty");
        }
        if ("error" in response) {
          throw new Error("Sad");
        }
        localStorage.setItem("access", response.accessToken);
        localStorage.setItem("refresh", response.refreshToken);
        navigate("/home", { state: response });
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
