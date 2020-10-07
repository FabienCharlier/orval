import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiMode } from './constants';
import { getSwaggerPetstoreApi } from './endpoints/petstoreFromFileSpecWithTransformer';
import { SwaggerPetstoreApi } from './endpoints/petstoreFromFileSpecWithTransformer.definition';
import { getSwaggerPetstoreApiMock } from './endpoints/petstoreFromFileSpecWithTransformer.mock';
import { getHTTPInstance } from './utilities';

export interface Api {
  petstore: SwaggerPetstoreApi;
}

interface ApiByMode {
  mock: () => Api;
  api: (instance: AxiosInstance) => Api;
}

const apiByMode: ApiByMode = {
  mock: () => ({
    petstore: getSwaggerPetstoreApiMock(),
  }),
  api: (instance: AxiosInstance) => ({
    petstore: getSwaggerPetstoreApi(instance),
  }),
};

export interface ApiParameters {
  headers?: { [key: string]: string | undefined };
  baseUrl?: string;
  interceptor?: {
    request?: {
      onFulfilled?: (
        value: AxiosRequestConfig,
      ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
      onRejected?: (error: any) => any;
    };
    response?: {
      onFulfilled?: (
        value: AxiosResponse,
      ) => AxiosResponse | Promise<AxiosResponse>;
      onRejected?: (error: any) => any;
    };
  };
  mode?: ApiMode;
}

export const getApi = ({
  headers = {},
  interceptor,
  baseUrl,
  mode = ApiMode.API,
}: ApiParameters): Api => {
  const instance = getHTTPInstance(baseUrl, headers, interceptor);

  return apiByMode[mode](instance);
};