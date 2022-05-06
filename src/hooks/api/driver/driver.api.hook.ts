import { ContentType, useHttp } from "../../http";
import { useEndpoint } from "../endpoint.hook";
import { LoginRequestDto, LoginResponseDto } from "./dto";

const req = useHttp();
const endpoint = useEndpoint();

const login = async (body: LoginRequestDto, apiVersion: string) => {
  return await req<LoginRequestDto, LoginResponseDto>({
    method: "POST",
    url: `${endpoint}/api/${apiVersion}/driver-person/login`,
    headers: {
      contentType: ContentType.JSON,
    },
    body,
  });
};

export const useDriverApi = () => {
  return {
    login: (body: LoginRequestDto, apiVersion?: string) =>
      login(body, apiVersion ?? "v1"),
  };
};
