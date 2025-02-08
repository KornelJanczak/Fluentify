"use client";

import { RestHelper } from "./rest-helper";

export class ClientAPI extends RestHelper {
  constructor() {
    super("http://localhost:5000/api/v1");
  }

  protected async interceptOptions(options: RequestInit): Promise<RequestInit> {
    options = {
      ...options,
      credentials: "include",
    };

    return options;
  }
}

export const clientApi = new ClientAPI();
