export interface MobileAppIdentity {
  readonly appName: string;
  readonly scheme: string;
  readonly iosBundleIdentifier: string;
  readonly androidPackage: string;
  readonly stageLabel?: string;
}

type Environment = Readonly<Record<string, string | undefined>>;

const CUSTOM_IDENTITY_VARIABLES = [
  "T3CODE_MOBILE_APP_NAME",
  "T3CODE_MOBILE_APP_SCHEME",
  "T3CODE_MOBILE_APP_IDENTIFIER",
] as const;

const APP_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*$/;
const APP_IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/;

function optionalValue(environment: Environment, name: string): string | undefined {
  const value = environment[name]?.trim();
  return value ? value : undefined;
}

export function resolveMobileAppIdentity(
  defaults: MobileAppIdentity,
  environment: Environment,
): MobileAppIdentity {
  const appName = optionalValue(environment, "T3CODE_MOBILE_APP_NAME");
  const scheme = optionalValue(environment, "T3CODE_MOBILE_APP_SCHEME");
  const identifier = optionalValue(environment, "T3CODE_MOBILE_APP_IDENTIFIER");
  const stageLabel = optionalValue(environment, "T3CODE_MOBILE_STAGE_LABEL");
  const customIdentityValues = [appName, scheme, identifier];

  if (customIdentityValues.some(Boolean) && customIdentityValues.some((value) => !value)) {
    throw new Error(
      `Custom mobile identity requires ${CUSTOM_IDENTITY_VARIABLES.join(", ")} to be set together.`,
    );
  }

  if (scheme && !APP_SCHEME_PATTERN.test(scheme)) {
    throw new Error(
      "T3CODE_MOBILE_APP_SCHEME must be a lowercase URI scheme such as t3code-internal.",
    );
  }

  if (identifier && !APP_IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error(
      "T3CODE_MOBILE_APP_IDENTIFIER must be a reverse-DNS identifier usable by both iOS and Android, such as com.example.t3code.internal.",
    );
  }

  return {
    appName: appName ?? defaults.appName,
    scheme: scheme ?? defaults.scheme,
    iosBundleIdentifier: identifier ?? defaults.iosBundleIdentifier,
    androidPackage: identifier ?? defaults.androidPackage,
    ...(stageLabel ? { stageLabel } : {}),
  };
}
