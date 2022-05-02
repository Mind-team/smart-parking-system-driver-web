export interface IBaseHttpRequest {
  readonly url: string;
  readonly headers?: Record<string, string>;
}
