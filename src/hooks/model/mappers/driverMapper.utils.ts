import { LoginResponseDto } from "../../api/driver";
import { IAnonDriver, IBaseDriver, IDriver, IKnowDriver } from "../models";

export const driverMapper = (dto: LoginResponseDto): IDriver => {
  const base: IBaseDriver = {
    id: dto.id,
    parkingProcessesIds: dto.parkingProcessesIds,
    currentParkingProcessesIds: dto.currentParkingProcessesIds,
    transportPlates: dto.transportPlates,
  };

  if (dto.personData?.phone) {
    const know: IKnowDriver = {
      ...base,
      isAnon: false,
      personData: dto.personData,
    };
    return know;
  }
  const anon: IAnonDriver = {
    ...base,
    isAnon: true,
  };
  return anon;
};
