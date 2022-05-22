import { IHttpRequest } from "./http-request.interface";
import { IHttpResponseError } from "./http-response-error.interface";
import { useHttp } from "./http.hook";
import { useStorage, StorageToken } from "../storage";

const req = useHttp();
const storage = useStorage();

const addAuthorizationHeader = (config: IHttpRequest<any>) => {
  const token = storage.read(StorageToken.AccessToken);
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
};

export const useAuthorizedHttp = (refreshToken?: () => Promise<boolean>) => {
  return async <Req, Res>(
    configObject: IHttpRequest<Req>,
  ): Promise<Res | IHttpResponseError | { isEmptyResponse: true }> => {
    if (!configObject) {
      throw new Error("Не указан конфиг для запроса");
    }
    const updatedConfigObject = addAuthorizationHeader(configObject);
    return req<Req, Res>(updatedConfigObject).then((response) => {
      if ("statusCode" in response && response.statusCode === 401) {
        if (refreshToken) {
          return refreshToken().then((isUpdateTokens: boolean) => {
            if (isUpdateTokens) {
              return req<Req, Res>(addAuthorizationHeader(configObject));
            }
            return response;
          });
        }
      }
      return response;
    });
  };
};
