import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";

interface ISettingsService {
  getChatSettingsByUserId(): Promise<SettingsResponse>;
}

class SettingsService implements ISettingsService {
  private BASIC_PATH = "/settings";

  constructor(public serverApi: ServerAPI) {}

  public async getChatSettingsByUserId() {
    try {
      return (
        await this.serverApi.get<SettingsResponse>(`${this.BASIC_PATH}/user`)
      ).data;
    } catch (error) {
      return null;
    }
  }
}

export const settingsService = new SettingsService(serverApi);

export type Settings = {
  learningLanguage: string;
  learningLanguageLevel: string;
  nativeLanguage: string;
  tutorId: string;
  autoCorrect: boolean;
  autoRecord: boolean;
  autoSend: boolean;
};

export type SettingsResponse = Settings | null;
