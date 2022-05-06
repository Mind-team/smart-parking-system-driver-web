import { IHttpRequest } from "./http-request.interface";
import { IHttpResponseError } from "./http-response-error.interface";

const parseHeadersToHttp = (
  headers: Record<string, string>,
): Record<string, string> => {
  const newHeaders: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (key === "contentType") {
      newHeaders["Content-Type"] = value;
      return;
    }
    newHeaders[key] = value;
  });
  return newHeaders;
};

export const useHttp = () => {
  return async <Req, Res>(
    configObject: IHttpRequest<Req>,
  ): Promise<Res | IHttpResponseError | { isEmptyResponse: true }> => {
    if (!configObject || !configObject.url || !configObject.method) {
      throw new Error(
        "You didn't specify a required parameter for the request",
      );
    }
    if ("headers" in configObject && configObject.headers) {
      configObject.headers = parseHeadersToHttp(configObject.headers);
    }
    if (configObject.method !== "GET" && "body" in configObject) {
      const response = await fetch(configObject.url, {
        method: configObject.method,
        body: JSON.stringify(configObject.body),
        headers: "headers" in configObject ? configObject.headers : {},
      });
      try {
        return await response.json();
      } catch (e) {
        if (e instanceof SyntaxError) {
          return { isEmptyResponse: true };
        }
        throw e;
      }
    }
    const response = await fetch(configObject.url, {
      method: "GET",
      headers: "headers" in configObject ? configObject.headers : {},
    });
    try {
      return await response.json();
    } catch (e) {
      if (e instanceof SyntaxError) {
        return { isEmptyResponse: true };
      }
      throw e;
    }
  };
};
