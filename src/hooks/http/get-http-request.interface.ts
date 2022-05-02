import { IBaseHttpRequest } from "./base-http-request.interface";

export interface IGetHttpRequest extends IBaseHttpRequest {
  readonly method: "GET";
}
