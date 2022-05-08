export interface IParkingProcess {
  id: string;
  parking: {
    id: string;
    title: string;
  };
  transport: {
    driverId: string;
    plate: string;
  };
  time: {
    entry: string;
    departure: string | null;
  };
  payment: {
    value: number;
    currency: string;
    status: number;
  } | null;
  isCompleted: boolean;
}
