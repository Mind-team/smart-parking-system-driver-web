import { ContentType, useHttp } from "../../http";
import { useEndpoint } from "../endpoint.hook";
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  SendConfirmationCodeRequestDto,
} from "./dto";
import { ApiVersion } from "../apiVersion.enum";

const req = useHttp();
const endpoint = useEndpoint();

const sendCode = async (
  body: SendConfirmationCodeRequestDto,
  apiVersion: ApiVersion,
) => {
  return await req<SendConfirmationCodeRequestDto, void>({
    method: "POST",
    url: `${endpoint}/api/${apiVersion}/auth/send-code`,
    headers: {
      contentType: ContentType.JSON,
    },
    body,
  });
};

const refreshToken = async (
  body: RefreshTokenRequestDto,
  apiVersion: ApiVersion,
) => {
  return await req<RefreshTokenRequestDto, RefreshTokenResponseDto>({
    method: "PUT",
    url: `${endpoint}/api/${apiVersion}/auth/refresh`,
    headers: {
      contentType: ContentType.JSON,
    },
    body,
  });
};

export const useAuthApi = () => {
  return {
    sendCode: (
      body: SendConfirmationCodeRequestDto,
      appVersion: ApiVersion = ApiVersion.v1,
    ) => sendCode(body, appVersion),
    refreshToken: (body: RefreshTokenRequestDto, apiVersion = ApiVersion.v1) =>
      refreshToken(body, apiVersion),
  };
};
