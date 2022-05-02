import { IBaseHttpRequest } from "./base-http-request.interface";

export interface IPostHttpRequest<T> extends IBaseHttpRequest {
  readonly method: "POST";
  readonly body: T;
}
