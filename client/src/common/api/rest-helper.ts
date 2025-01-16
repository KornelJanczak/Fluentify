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
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        ...options?.headers,
      },
    };

    adjustedOptions = await this.interceptOptions(adjustedOptions);

    const response = await fetch(adjustedUrl, adjustedOptions);
    if (!response.ok) {
      throw new HttpError(response.status, await response.text());
    }

    const data = await response.json();

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
      body: body,
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
      body: body,
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
      body: body,
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
