import { ContentType } from "./content-type.enum";

export interface IBaseHttpRequest {
  readonly url: string;
  headers?: Record<string, string> & { contentType?: ContentType };
}
