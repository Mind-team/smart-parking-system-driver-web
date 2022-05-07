import React, { FC } from "react";
import { Button, InputField, ValidatorResponse } from "sps-ui";
import classes from "./Login.page.styles.module.css";

export interface ILoginPageProps {
  phoneNumberValueChanges: (value: string) => void;
  smsCodeValueChanges: (value: string) => void;
  onSendCodeButtonClick: () => void;
  onSendSmsCodeButtonClick: () => void;
  isShowCodeField: boolean;
  isError: boolean;
}
const phoneNumberValidator = (value: string): ValidatorResponse => {
  if (value.length !== 11) {
    return {
      isValid: false,
      message: "Телефон должен быть в формате 7ХХХХХХХХХХ",
    };
  }
  return {
    isValid: true,
  };
};

export const LoginPage: FC<ILoginPageProps> = ({
  phoneNumberValueChanges,
  smsCodeValueChanges,
  onSendCodeButtonClick,
  onSendSmsCodeButtonClick,
  isShowCodeField,
  isError,
}) => {
  return (
    <div className={classes.wrapper}>
      {isError && <div>Что-то пошло не так</div>}
      <InputField
        type={"numbers"}
        placeholder={"Номер телефона"}
        isDisabled={isShowCodeField}
        valueChanges={phoneNumberValueChanges}
        validators={[phoneNumberValidator]}
      />
      {isShowCodeField && (
        <InputField
          placeholder={"Код из СМС"}
          type={"numbers"}
          valueChanges={smsCodeValueChanges}
        />
      )}
      {isShowCodeField ? (
        <Button title={"Отправить код"} onClick={onSendSmsCodeButtonClick} />
      ) : (
        <Button title={"Отправить СМС"} onClick={onSendCodeButtonClick} />
      )}
    </div>
  );
};
