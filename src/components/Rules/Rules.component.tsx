import React, { FC } from "react";
import classes from "./Rules.styles.module.css";

export const RulesComponent: FC = () => {
  const firstRule =
    "Перед въездом проверьте, что задний регистрационный знак читаем";
  const secondRule =
    "При въезде на парковку наша камера считает номер вашего транспортного средства, от вас никаких действий не требуется";
  const thirdRule =
    "При выезде камера считает номер транспортного  средства, затем автоматически спишет с вашей карты нужную сумму и откроет шлагбаум";
  return (
    <div className={classes.wrapper}>
      <div className={classes.rulesWrapper}>
        <div className={classes.lineWrapper}>
          <span className={classes.lineNumber}>1</span>
          <span className={classes.lineDescription}>{firstRule}</span>
        </div>
        <div className={classes.lineWrapper}>
          <span className={classes.lineNumber}>2</span>
          <span className={classes.lineDescription}>{secondRule}</span>
        </div>
        <div className={classes.lineWrapper}>
          <span className={classes.lineNumber}>3</span>
          <span className={classes.lineDescription}>{thirdRule}</span>
        </div>
      </div>
    </div>
  );
};
