import { useHttp, ContentType } from "../../http";
import { useEndpoint } from "../endpoint.hook";
import { SendConfirmationCodeRequestDto } from "./dto";

const req = useHttp();
const endpoint = useEndpoint();

const sendCode = async (
  body: SendConfirmationCodeRequestDto,
  apiVersion: string,
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

export const useAuthApi = () => {
  return {
    sendCode: (body: SendConfirmationCodeRequestDto, appVersion?: string) =>
      sendCode(body, appVersion ?? "v1"),
  };
};
