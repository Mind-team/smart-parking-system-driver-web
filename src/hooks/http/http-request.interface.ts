import { IGetHttpRequest } from "./get-http-request.interface";
import { IPostHttpRequest } from "./post-http-request.interface";
import { IPutHttpRequest } from "./put-http-request.interface";

export type IHttpRequest<T> =
  | IGetHttpRequest
  | IPostHttpRequest<T>
  | IPutHttpRequest<T>;
