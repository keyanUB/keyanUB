const fs = require("fs");

const quotes = [
  { text: "It always seems impossible until it's done.", source: "Nelson Mandela", language: "en", translation: "在完成之前，一切看起来都像是不可能。" },
  { text: "The journey of a thousand miles begins with one step.", source: "Laozi, Tao Te Ching", language: "en", translation: "千里之行，始于足下。" },
  { text: "What you do today can improve all your tomorrows.", source: "Ralph Marston", language: "en", translation: "你今天做的事，可以改善所有的明天。" },
  { text: "Act as if what you do makes a difference. It does.", source: "William James", language: "en", translation: "像你的行动真的会带来改变那样去行动。它确实会。" },
  { text: "Knowing yourself is the beginning of all wisdom.", source: "Aristotle", language: "en", translation: "认识自己，是一切智慧的开始。" },
  { text: "读书破万卷，下笔如有神。", source: "杜甫，《奉赠韦左丞丈二十二韵》", language: "zh", translation: "After reading thousands of books, writing comes as if guided by spirit." },
  { text: "天行健，君子以自强不息。", source: "《周易》", language: "zh", translation: "As heaven moves with strength, one should keep striving without rest." },
  { text: "不积跬步，无以至千里。", source: "荀子，《劝学》", language: "zh", translation: "Without small steps, there is no way to reach a thousand miles." },
  { text: "Do not wait to strike till the iron is hot; make it hot by striking.", source: "William Butler Yeats", language: "en", translation: "不要等铁热了才锤打；通过锤打让它变热。" },
  { text: "The future depends on what you do today.", source: "Mahatma Gandhi", language: "en", translation: "未来取决于你今天做什么。" }
];

function newYorkDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));
}

function todayIndex(year, month, day) {
  const key = `${year}-${month}-${day}`;
  let n = 0;
  for (const ch of key) n = (n * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(n) % quotes.length;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const { year, month, day } = newYorkDateParts(new Date());
const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
const quote = quotes[todayIndex(year, month, day)];
const mainLine = quote.language === "zh" ? quote.translation : quote.text;
const translationLine = quote.language === "zh" ? quote.text : quote.translation;

const block = `<!-- DAILY_QUOTE_START -->
<table align="center" width="100%">
  <tr>
    <td width="100%" align="center">
      <sub><strong>Today's Thought · ${date}</strong></sub><br><br>
      <strong><em>${escapeHtml(mainLine)}</em></strong><br>
      <div align="right"><sub>${escapeHtml(quote.source)}</sub></div>
      <br>
      <code>${escapeHtml(translationLine)}</code>
    </td>
  </tr>
</table>
<!-- DAILY_QUOTE_END -->`;

const start = "<!-- DAILY_QUOTE_START -->";
const end = "<!-- DAILY_QUOTE_END -->";
const readmePath = "README.md";
const readme = fs.readFileSync(readmePath, "utf8");
const startIndex = readme.indexOf(start);
const endIndex = readme.indexOf(end, startIndex);

if (startIndex === -1 || endIndex === -1) {
  throw new Error("README daily quote markers were not found.");
}

const afterEnd = endIndex + end.length;
const nextReadme = readme.slice(0, startIndex) + block + readme.slice(afterEnd);
fs.writeFileSync(readmePath, nextReadme);
