export class RestHelper {
  protected readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async interceptOptions(options: RequestInit) {
    return options;
  }

  protected async fetchJSON<T>(
    url: string,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    const adjustedUrl = `${this.baseUrl}${url}`;

    let adjustedOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    };

    adjustedOptions = await this.interceptOptions(adjustedOptions);

    const response = await fetch(adjustedUrl, adjustedOptions);

    if (!response.ok) {
      console.log("nie ok", response);
      throw new HttpError(response.status, await response.text());
    }

    // console.log("response 3", response);
    console.log("bodydas json",  response);

    const data = await response.json();

    // console.log("data", data);
    // console.log("headers", response.headers);
    // console.log("status", response.status);

    return {
      status: response.status,
      headers: response.headers,
      data,
    };
  }

  public async get<T>(
    url: string,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    return this.fetchJSON(url, {
      method: "GET",
      ...options,
    });
  }

  public async post<T>(
    url: string,
    body: any,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    return this.fetchJSON(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  public async put<T>(
    url: string,
    body: any,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    return this.fetchJSON(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  }

  public async delete<T>(
    url: string,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    return this.fetchJSON(url, {
      method: "DELETE",
      ...options,
    });
  }

  public async patch<T>(
    url: string,
    body: any,
    options?: RequestInit
  ): Promise<RestResponse<T>> {
    return this.fetchJSON(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    });
  }
}

export interface RestResponse<T = any> {
  status: number;
  headers: Headers;
  data: T;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
