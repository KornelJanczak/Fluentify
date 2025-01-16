import { RestHelper } from "./rest-helper";

class ClientAPI extends RestHelper {
  constructor() {
    super("http://localhost:5000/api/v1");
  }
}

export const clientApi = new ClientAPI();
