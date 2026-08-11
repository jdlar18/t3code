export function resolveMobileStageLabel(appVariant: unknown, customLabel?: unknown): string {
  if (typeof customLabel === "string" && customLabel.trim()) return customLabel.trim();
  if (appVariant === "development") return "Dev";
  if (appVariant === "preview") return "Nightly";
  return "Alpha";
}
