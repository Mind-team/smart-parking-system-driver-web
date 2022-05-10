import { IHttpRequest } from "./http-request.interface";
import { IHttpResponseError } from "./http-response-error.interface";
import { useHttp } from "./http.hook";
import { useStorage } from "../storage";
import { StorageToken } from "../storage/storageToken.enum";

export const useAuthorizedHttp = () => {
  return async <Req, Res>(
    configObject: IHttpRequest<Req>,
  ): Promise<Res | IHttpResponseError | { isEmptyResponse: true }> => {
    const req = useHttp();
    const storage = useStorage();
    if (
      configObject &&
      "headers" in configObject &&
      storage.read(StorageToken.AccessToken)
    ) {
      // TODO:
      // @ts-ignore
      configObject.headers["Authorization"] = `Bearer ${storage.read(
        StorageToken.AccessToken,
      )}`;
    }
    return req<Req, Res>(configObject).then((response) => {
      if ("statusCode" in response && response.statusCode === 401) {
        console.log("Need to refresh token");
      }
      return response;
    });
  };
};
