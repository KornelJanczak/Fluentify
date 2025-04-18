import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";
import { clientApi } from "@/common/api/client-api";
import { redirect, unauthorized } from "next/navigation";

class AuthService {
  serverApi: ServerAPI;

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  public async getUser() {
    try {
      return (await this.serverApi.get<UserResponse>("/auth/session")).data;
    } catch (error) {
      if (error.status === 401) return redirect("/auth/sign-in");

      if (!(error instanceof HttpError)) throw error;

      throw error;
    }
  }

  public async logOut() {
    try {
      return (await clientApi.get<UserResponse>("/auth/logout")).data;
    } catch (error) {
      if (error.status === 401) return redirect("/auth/sign-in");

      if (!(error instanceof HttpError)) throw error;

      throw error;
    }
  }
}

export const authService = new AuthService(serverApi);

export type User = {
  id: string;
  email: string;
  name: string;
  imagePath: string;
  role: string;
  subscriptionExpiryDate: string;
  studyingLanguageLevel: string;
  nativeLanguage: string;
  tutorId: string;
};

export type UserResponse = User | null;
