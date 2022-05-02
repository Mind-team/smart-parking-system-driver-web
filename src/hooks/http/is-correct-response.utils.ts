import { IHttpResponseError } from ".";

export const isCorrectResponse = <T>(
  response: T | IHttpResponseError | { isEmptyResponse: true },
): response is T => {
  return !("error" in response || "isEmptyResponse" in response);
};
