/**
 * Testes do escape CSV (A4 fix).
 * Rodar standalone com: `pnpm tsx src/lib/export/__tests__/csv.test.ts`
 *
 * Não roda no Jest/Vitest ainda — é só smoke-assert com node:assert.
 */
import assert from "node:assert/strict";
import { csvEscape, toCsv } from "../csv";

// Cenários de CSV injection — prefixo `'` (e envolvido em aspas se tiver
// aspas/vírgula, com escape `""`)
assert.equal(csvEscape("=HYPERLINK(\"evil\")"), `"'=HYPERLINK(""evil"")"`);
assert.equal(csvEscape("+cmd"), "'+cmd");
assert.equal(csvEscape("-exec"), "'-exec");
assert.equal(csvEscape("@SUM(A1)"), "'@SUM(A1)");
// Aceita mesmo quando não há aspas
assert.equal(csvEscape("=1+1"), "'=1+1");

// RFC 4180
assert.equal(csvEscape("hello, world"), `"hello, world"`);
assert.equal(csvEscape('ab"cd'), `"ab""cd"`);
assert.equal(csvEscape("line1\nline2"), `"line1\nline2"`);

// Null/undefined
assert.equal(csvEscape(null), "");
assert.equal(csvEscape(undefined), "");

// Formato final
const out = toCsv(["col"], [["=danger"], ["ok"]]);
assert.ok(out.startsWith("\uFEFF"));
assert.ok(out.includes("'=danger"));

console.log("✓ csv.test.ts — todos os asserts passaram");
