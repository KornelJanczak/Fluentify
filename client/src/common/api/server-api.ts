import { cookies } from "next/headers";
import { RestHelper } from "./rest-helper";

export class ServerAPI extends RestHelper {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  protected async interceptOptions(options: RequestInit): Promise<RequestInit> {
    options.headers = {
      ...options.headers,
      credentials: "include",
      Cookie: (await cookies()).toString(),
    };

    return options;
  }
}

export const serverApi = new ServerAPI();
