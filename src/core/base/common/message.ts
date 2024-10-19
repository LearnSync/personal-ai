export function formatMessage(
  message: string,
  args: (string | number | boolean | undefined | null)[]
): string {
  if (args.length === 0) {
    return message;
  }

  return message.replace(/\{(\d+)\}/g, (match, index) => {
    const argIndex = Number(index);
    const arg = args[argIndex];

    if (arg === undefined || arg === null) {
      return "";
    }

    return String(arg);
  });
}
