export interface IBaseDriver {
  id: string;
  transportPlates: string[];
  parkingProcessesIds: string[];
  currentParkingProcessesIds: string[];
}
export interface IAnonDriver extends IBaseDriver {
  isAnon: true;
}

export interface IKnowDriver extends IBaseDriver {
  personData: {
    phone: string;
    email?: string;
  };
  isAnon: false;
}

export type IDriver = IAnonDriver | IKnowDriver;
