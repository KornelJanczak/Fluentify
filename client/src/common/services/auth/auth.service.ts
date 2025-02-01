import { HttpError } from "@/common/services/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/services/api/server-api";
import { clientApi } from "@/common/services/api/client-api";

export const getUserKey = ["users", "me"];

class AuthService {
  serverApi: ServerAPI;

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  async getUser() {
    try {
      return (
        await this.serverApi.get<UserResponse>("/auth/session", {
          next: { tags: [getUserKey.join()] },
        })
      ).data;
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      if (error.status === 401) {
        return null;
      }

      throw error;
    }
  }

  async logOut() {
    try {
      return (await clientApi.get<UserResponse>("/auth/logout")).data;
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      if (error.status === 401) {
        return null;
      }

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
