export function slugify(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // Strip Spanish accents by mapping common accented vowels/ñ manually
      // (avoids relying on combining-mark unicode ranges in source).
      const map: Record<string, string> = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        ü: "u",
        ñ: "n",
      };
      if (map[char]) return map[char];
      if (code < 128) return char;
      return "";
    })
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
