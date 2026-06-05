import { describe, it, expect } from "vitest";
import { parseJsonObject, parseStringArray, salvageArrayObjects } from "@/lib/providers/parse";
import { AppError } from "@/lib/errors";

describe("parseJsonObject", () => {
  it("parseia JSON puro", () => {
    expect(parseJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it("tolera cercas de código que envolvem todo o conteúdo", () => {
    expect(parseJsonObject('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("recorta prosa residual em volta do objeto", () => {
    expect(parseJsonObject('Claro!\n{"a":1}\nEspero ter ajudado.')).toEqual({ a: 1 });
  });

  it("lança AppError em JSON inválido", () => {
    expect(() => parseJsonObject("sem json aqui")).toThrow(AppError);
  });
});

describe("parseStringArray", () => {
  it("extrai array de strings de um campo, filtrando vazios", () => {
    const out = parseStringArray('{"questions":["a","","b"]}', "questions");
    expect(out).toEqual(["a", "b"]);
  });

  it("lança AppError quando o campo não é array", () => {
    expect(() => parseStringArray('{"questions":"x"}', "questions")).toThrow(AppError);
  });
});

describe("salvageArrayObjects", () => {
  it("recupera objetos completos de um array truncado", () => {
    const truncated = '{"tasks":[{"title":"A"},{"title":"B"},{"title":"C inc';
    expect(salvageArrayObjects(truncated)).toEqual([{ title: "A" }, { title: "B" }]);
  });

  it("ignora chaves dentro de strings (string-aware)", () => {
    const raw = '{"items":[{"desc":"usa { e } no meio"},{"desc":"ok"}]}';
    const objs = salvageArrayObjects(raw) as { desc: string }[];
    expect(objs).toHaveLength(2);
    expect(objs[0]?.desc).toContain("{");
  });

  it("retorna vazio quando não há array", () => {
    expect(salvageArrayObjects("sem array")).toEqual([]);
  });
});
