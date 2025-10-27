/**
 * Converts Unicode bold script characters to normal ASCII characters
 * Useful for matching Discord channel names that use styled Unicode text
 * @param text - The text containing Unicode bold script characters
 * @returns The normalized text in lowercase ASCII
 */
export function normalizeUnicodeText(text: string): string {
  return text
    .replace(/𝘼/g, "A")
    .replace(/𝘽/g, "B")
    .replace(/𝘾/g, "C")
    .replace(/𝘿/g, "D")
    .replace(/𝙀/g, "E")
    .replace(/𝙁/g, "F")
    .replace(/𝙂/g, "G")
    .replace(/𝙃/g, "H")
    .replace(/𝙄/g, "I")
    .replace(/𝙅/g, "J")
    .replace(/𝙆/g, "K")
    .replace(/𝙇/g, "L")
    .replace(/𝙈/g, "M")
    .replace(/𝙉/g, "N")
    .replace(/𝙊/g, "O")
    .replace(/𝙋/g, "P")
    .replace(/𝙌/g, "Q")
    .replace(/𝙍/g, "R")
    .replace(/𝙎/g, "S")
    .replace(/𝙏/g, "T")
    .replace(/𝙐/g, "U")
    .replace(/𝙑/g, "V")
    .replace(/𝙒/g, "W")
    .replace(/𝙓/g, "X")
    .replace(/𝙔/g, "Y")
    .replace(/𝙕/g, "Z")
    .toLowerCase();
}

/**
 * Checks if a Unicode styled text contains a normal text string
 * @param unicodeText - The text with Unicode styling (like channel names)
 * @param searchText - The normal text to search for
 * @returns Whether the Unicode text contains the search text
 */
export function unicodeTextIncludes(
  unicodeText: string,
  searchText: string
): boolean {
  const normalizedUnicode = normalizeUnicodeText(unicodeText);
  const normalizedSearch = searchText.toLowerCase();
  return normalizedUnicode.includes(normalizedSearch);
}
