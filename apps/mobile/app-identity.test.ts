import { describe, expect, it } from "vite-plus/test";

import { resolveMobileAppIdentity, type MobileAppIdentity } from "./app-identity";

const defaults: MobileAppIdentity = {
  appName: "T3 Code Preview",
  scheme: "t3code-preview",
  iosBundleIdentifier: "com.t3tools.t3code.preview",
  androidPackage: "com.t3tools.t3code.preview",
};

describe("resolveMobileAppIdentity", () => {
  it("keeps the variant identity when no source-build overrides are set", () => {
    expect(resolveMobileAppIdentity(defaults, {})).toEqual(defaults);
  });

  it("creates one cross-platform identity for a separately installable source build", () => {
    expect(
      resolveMobileAppIdentity(defaults, {
        T3CODE_MOBILE_APP_NAME: " T3 Code Internal ",
        T3CODE_MOBILE_APP_SCHEME: " t3code-internal ",
        T3CODE_MOBILE_APP_IDENTIFIER: " com.example.t3code.internal ",
        T3CODE_MOBILE_STAGE_LABEL: " Internal ",
      }),
    ).toEqual({
      appName: "T3 Code Internal",
      scheme: "t3code-internal",
      iosBundleIdentifier: "com.example.t3code.internal",
      androidPackage: "com.example.t3code.internal",
      stageLabel: "Internal",
    });
  });

  it("allows a custom stage badge without changing the native app identity", () => {
    expect(resolveMobileAppIdentity(defaults, { T3CODE_MOBILE_STAGE_LABEL: "Internal" })).toEqual({
      ...defaults,
      stageLabel: "Internal",
    });
  });

  it("rejects a partial custom identity", () => {
    expect(() =>
      resolveMobileAppIdentity(defaults, {
        T3CODE_MOBILE_APP_NAME: "T3 Code Internal",
        T3CODE_MOBILE_APP_SCHEME: "t3code-internal",
      }),
    ).toThrow("T3CODE_MOBILE_APP_IDENTIFIER");
  });

  it.each(["T3 Code", "3code", "T3CODE", "t3code_internal"])(
    "rejects invalid URI scheme %s",
    (scheme) => {
      expect(() =>
        resolveMobileAppIdentity(defaults, {
          T3CODE_MOBILE_APP_NAME: "T3 Code Internal",
          T3CODE_MOBILE_APP_SCHEME: scheme,
          T3CODE_MOBILE_APP_IDENTIFIER: "com.example.t3code.internal",
        }),
      ).toThrow("lowercase URI scheme");
    },
  );

  it.each(["t3code", "com.example.t3-code", "com.example.3code"])(
    "rejects an identifier that cannot be shared by iOS and Android: %s",
    (identifier) => {
      expect(() =>
        resolveMobileAppIdentity(defaults, {
          T3CODE_MOBILE_APP_NAME: "T3 Code Internal",
          T3CODE_MOBILE_APP_SCHEME: "t3code-internal",
          T3CODE_MOBILE_APP_IDENTIFIER: identifier,
        }),
      ).toThrow("reverse-DNS identifier");
    },
  );
});
