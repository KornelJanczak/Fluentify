import { cookies } from "next/headers";
import { RestHelper } from "./rest-helper";

export class ServerAPI extends RestHelper {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL);
  }

  protected async interceptOptions(options: RequestInit): Promise<RequestInit> {
    const token = await this.getSessionCookies();

    if (token) {
      options.headers = {
        ...options.headers,
        credentials: "include",
        Cookie: token,
      };
    }

    return options;
  }

  public async getSessionCookies() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("fluentify-server-session").value;
    const sessionSignature = cookieStore.get(
      "fluentify-server-session.sig"
    ).value;

    if (!sessionId || !sessionSignature) {
      throw new Error("Session cookies are missing");
    }

    const sessionCookie =
      "fluentify-server-session=" +
      sessionId +
      "; fluentify-server-session.sig=" +
      sessionSignature;

    return sessionCookie;
  }
}

export const serverApi = new ServerAPI();
