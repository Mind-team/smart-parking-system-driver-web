import { ContentType, useAuthorizedHttp, useHttp } from "../../http";
import { useEndpoint } from "../endpoint.hook";
import {
  GetParkingProcessResponseDto,
  LoginRequestDto,
  LoginResponseDto,
} from "./dto";
import { ApiVersion } from "../apiVersion.enum";

const req = useHttp();
const authReq = useAuthorizedHttp();
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
  console.log(id);
  return await authReq<null, GetParkingProcessResponseDto>({
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
