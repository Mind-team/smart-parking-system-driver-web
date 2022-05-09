export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  id: string;
  transportPlates: string[];
  parkingProcessesIds: string[];
  currentParkingProcessesIds: string[];
  personData?: {
    phone: string;
    email?: string;
  };
}
