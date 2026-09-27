export function translateCountry(
  countryCode: string,
  language: string,
): string {
  if (!countryCode) {
    return "";
  }

  try {
    const displayNames = new Intl.DisplayNames([language], {
      type: "region",
    });

    return displayNames.of(countryCode.toUpperCase()) ?? countryCode;
  } catch {
    return countryCode;
  }
}
