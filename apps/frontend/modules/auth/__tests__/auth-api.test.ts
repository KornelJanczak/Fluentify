// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentUserId, saveAccessToken } from "../api";

describe("getCurrentUserId", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no token is present", () => {
    expect(getCurrentUserId()).toBeNull();
  });

  it("decodes sub correctly from a standard JWT", () => {
    const payload = btoa(JSON.stringify({ sub: "user-standard" }));
    const token = `header.${payload}.sig`;
    expect(getCurrentUserId(token)).toBe("user-standard");
  });

  it("decodes sub correctly when payload contains Base64Url characters (- and _) and unpadded length", () => {
    // Generate a payload that produces Base64Url with `-` and `_`
    const rawJson = JSON.stringify({ sub: "user-id-with-special-uuid", extra: "test_value" });
    // base64url: replace + with -, / with _, remove = padding
    const base64Url = btoa(rawJson).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const token = `header.${base64Url}.sig`;

    expect(getCurrentUserId(token)).toBe("user-id-with-special-uuid");
  });

  it("reads token from localStorage when not passed explicitly", () => {
    const payload = btoa(JSON.stringify({ sub: "user-from-storage" }));
    saveAccessToken(`header.${payload}.sig`);

    expect(getCurrentUserId()).toBe("user-from-storage");
  });

  it("returns null on malformed token or missing sub", () => {
    expect(getCurrentUserId("not-a-valid-jwt")).toBeNull();
    const noSub = btoa(JSON.stringify({ foo: "bar" }));
    expect(getCurrentUserId(`header.${noSub}.sig`)).toBeNull();
  });
});
