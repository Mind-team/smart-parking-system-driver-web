import { GetParkingProcessResponseDto } from "../../api/driver";
import { IParkingProcess } from "../models/parkingProcess.interface";

export const parkingProcessMapper = (
  dto: GetParkingProcessResponseDto,
): IParkingProcess => {
  return {
    id: dto.id,
    parking: {
      id: dto.parking.id,
      title: dto.parking.title,
    },
    transport: {
      driverId: dto.transport.driverId,
      plate: dto.transport.plate,
    },
    time: {
      entry: dto.time.entry,
      departure: dto.time.departure ?? null,
    },
    payment: dto.payment ? { ...dto.payment } : null,
    isCompleted: dto.isCompleted,
  };
};
