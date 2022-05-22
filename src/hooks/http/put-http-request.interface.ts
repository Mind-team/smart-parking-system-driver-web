import { IBaseHttpRequest } from "./base-http-request.interface";

export interface IPutHttpRequest<T> extends IBaseHttpRequest {
  readonly method: "PUT";
  readonly body: T;
}
