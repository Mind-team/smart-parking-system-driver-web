import React from "react";
import classes from "./Sortbar.styles.module.css";
import { FC } from "react";

export interface ISortbarProps {
  parameters: string[];
  click: (parameter: string) => void;
}

export const Sortbar: FC<ISortbarProps> = ({ parameters, click }) => {
  return (
    <div className={classes.wrapper}>
      {parameters.map((title, key) => (
        <span className={classes.text} key={key} onClick={() => click(title)}>
          {title}
        </span>
      ))}
    </div>
  );
};
