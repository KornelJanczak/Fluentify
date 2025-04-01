import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export class RestHelper {
  protected readonly axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "text",
    });

    this.axiosInstance.interceptors.request.use(
      (config) => this.interceptRequest(config),
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => this.parseResponse(response),
      (error) => this.handleError(error)
    );
  }

  private parseResponse(response: AxiosResponse): AxiosResponse {
    try {
      if (typeof response.data === "string") {
        response.data = JSON.parse(response.data);
      }
    } catch (e) {
      // Pozostawiamy dane jako tekst jeśli parsowanie się nie uda
    }
    return response;
  }

  protected interceptRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> | InternalAxiosRequestConfig {
    return config;
  }

  protected handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const data = error.response.data;
      const message = typeof data === "object" ? JSON.stringify(data) : data;
      console.log("error", error);

      throw new HttpError(error.response.status, message as string);
    } else if (error.request) {
      throw new HttpError(0, "Network error");
    } else {
      throw new HttpError(0, error.message);
    }
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<RestResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    return this.createRestResponse(response);
  }

  public async post<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig
  ): Promise<RestResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, body, config);
    return this.createRestResponse(response);
  }

  public async put<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig
  ): Promise<RestResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, body, config);
    return this.createRestResponse(response);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<RestResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return this.createRestResponse(response);
  }

  public async patch<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig
  ): Promise<RestResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, body, config);
    return this.createRestResponse(response);
  }

  private createRestResponse<T>(response: AxiosResponse<T>): RestResponse<T> {
    return {
      status: response.status,
      headers: response.headers as Record<string, string>,
      data: response.data,
    };
  }
}

export interface RestResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
