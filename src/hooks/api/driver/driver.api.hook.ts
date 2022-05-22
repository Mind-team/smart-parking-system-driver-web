import { ContentType, useAuthorizedHttp, useHttp } from "../../http";
import { useEndpoint } from "../endpoint.hook";
import {
  GetParkingProcessResponseDto,
  LoginRequestDto,
  LoginResponseDto,
} from "./dto";
import { ApiVersion } from "../apiVersion.enum";
import { useAuthApi } from "../auth";
import { useStorage, StorageToken } from "../../storage";

const req = useHttp();
const storage = useStorage();
const authApi = useAuthApi();
const authReq = useAuthorizedHttp(() => {
  const refreshToken = storage.read(StorageToken.RefreshToken);
  if (refreshToken) {
    return authApi
      .refreshToken({
        refreshToken,
      })
      .then((response) => {
        if ("isEmptyResponse" in response || "error" in response) {
          return Promise.resolve(false);
        }
        storage.write(StorageToken.AccessToken, response.accessToken);
        storage.write(StorageToken.RefreshToken, response.refreshToken);
        return Promise.resolve(true);
      });
  }
  return Promise.resolve(false);
});
const endpoint = useEndpoint();

const login = async (body: LoginRequestDto, apiVersion: ApiVersion) => {
  return await req<LoginRequestDto, LoginResponseDto>({
    method: "POST",
    url: `${endpoint}/api/${apiVersion}/driver-person/login`,
    headers: {
      contentType: ContentType.JSON,
    },
    body,
  });
};

const parkingProcess = async (
  id: string | "current",
  apiVersion: ApiVersion,
) => {
  return await authReq<
    null,
    GetParkingProcessResponseDto | GetParkingProcessResponseDto[]
  >({
    method: "GET",
    url: `${endpoint}/api/${apiVersion}/driver-person/parking-processes/${id}`,
    headers: {
      contentType: ContentType.JSON,
    },
  });
};

const parkingProcesses = async (apiVersion: ApiVersion) => {
  return await authReq<null, GetParkingProcessResponseDto[]>({
    method: "GET",
    url: `${endpoint}/api/${apiVersion}/driver-person/parking-processes`,
    headers: {
      contentType: ContentType.JSON,
    },
  });
};

const personalData = async (apiVersion: ApiVersion) => {
  return await authReq<
    null,
    Omit<LoginResponseDto, "accessToken" | "refreshToken">
  >({
    method: "GET",
    url: `${endpoint}/api/${apiVersion}/driver-person`,
    headers: {
      contentType: ContentType.JSON,
    },
  });
};

export const useDriverApi = () => {
  return {
    login: (body: LoginRequestDto, apiVersion: ApiVersion = ApiVersion.v1) =>
      login(body, apiVersion),
    parkingProcess: (
      id: string | "current",
      apiVersion: ApiVersion = ApiVersion.v1,
    ) => parkingProcess(id, apiVersion),
    parkingProcesses: (apiVersion: ApiVersion = ApiVersion.v1) =>
      parkingProcesses(apiVersion),
    data: (apiVersion: ApiVersion = ApiVersion.v1) => personalData(apiVersion),
  };
};
