import { describe, expect, it } from "vite-plus/test";

import { resolveMobileStageLabel } from "./mobileBranding";

describe("resolveMobileStageLabel", () => {
  it.each([
    ["development", "Dev"],
    ["preview", "Nightly"],
    ["production", "Alpha"],
    [undefined, "Alpha"],
  ])("maps %s builds to %s", (appVariant, expected) => {
    expect(resolveMobileStageLabel(appVariant)).toBe(expected);
  });

  it("uses a trimmed source-build label when one is configured", () => {
    expect(resolveMobileStageLabel("preview", " Cockpit ")).toBe("Cockpit");
  });

  it("ignores an empty source-build label", () => {
    expect(resolveMobileStageLabel("preview", "   ")).toBe("Nightly");
  });
});
