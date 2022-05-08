import { ModelToken } from "./modelToken.enum";
import { parkingProcessMapper } from "./mappers/parkingProcessMapper.utils";

export const useModelFactory = () => {
  return <Model>(token: ModelToken, dto: any): Model => {
    switch (token) {
      case ModelToken.ParkingProcess:
        return parkingProcessMapper(dto) as unknown as Model;
      default:
        throw new Error("Не существует токена ", token);
    }
  };
};
