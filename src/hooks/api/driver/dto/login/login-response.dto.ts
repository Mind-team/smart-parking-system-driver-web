export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  id: string;
  transportPlates: string[];
  parkingProcessesIds: string[];
  currentParkingProcessId: string | null;
  personData?: {
    phone: string;
    email?: string;
  };
}
