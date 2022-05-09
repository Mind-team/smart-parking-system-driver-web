import { ModelToken } from "./modelToken.enum";
import { driverMapper, parkingProcessMapper } from "../mappers";

export const useModelFactory = () => {
  return <Model>(token: ModelToken, dto: any): Model => {
    switch (token) {
      case ModelToken.ParkingProcess:
        return parkingProcessMapper(dto) as unknown as Model;
      case ModelToken.Driver:
        return driverMapper(dto) as unknown as Model;
      default:
        throw new Error("Не существует токена ", token);
    }
  };
};
