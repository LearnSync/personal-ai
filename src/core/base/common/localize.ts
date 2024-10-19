import { getMessageFromRegistry } from "./globalMessageRegistry";
import { formatMessage } from "./message";

export interface ILocalizationInfo {
  key: string;
  comment: string[];
}

export interface ILocalizedMessage {
  original: string;
  value: string;
}

export function localize(
  data: ILocalizationInfo | string | number,
  defaultMessage: string,
  ...args: (string | number | boolean | undefined | null)[]
): string {
  let message: string;

  if (typeof data === "number") {
    message = getMessageFromRegistry(data, defaultMessage);
  } else {
    message = defaultMessage;
  }

  return formatMessage(message, args);
}

export function localizeWithOriginal(
  data: ILocalizationInfo | string | number,
  originalMessage: string,
  ...args: (string | number | boolean | undefined | null)[]
): ILocalizedMessage {
  let localizedMessage: string;

  if (typeof data === "number") {
    localizedMessage = getMessageFromRegistry(data, originalMessage);
  } else {
    localizedMessage = originalMessage;
  }

  const formattedMessage = formatMessage(localizedMessage, args);
  const originalFormattedMessage = formatMessage(originalMessage, args);

  return {
    value: formattedMessage,
    original:
      originalMessage === localizedMessage
        ? formattedMessage
        : originalFormattedMessage,
  };
}
