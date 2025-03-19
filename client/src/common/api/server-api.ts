import { cookies } from "next/headers";
import { RestHelper } from "./rest-helper";
import type { InternalAxiosRequestConfig } from "axios";

export class ServerAPI extends RestHelper {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  protected async interceptRequest(config: InternalAxiosRequestConfig) {
    config.headers.set("Cookie", (await cookies()).toString());
    config.withCredentials = true;
    return config;
  }
}

export const serverApi = new ServerAPI();
