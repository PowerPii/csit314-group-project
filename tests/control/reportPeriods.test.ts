import { describe, expect, it } from "vitest";
import { dayRange, monthRange, parseSgDate, weekRange } from "@/control/reportPeriods";

describe("report periods (Singapore time, UTC+8)", () => {
  it("reads a YYYY-MM-DD date as midnight in Singapore", () => {
    expect(parseSgDate("2026-11-02")).toEqual(new Date("2026-11-01T16:00:00Z"));
    expect(parseSgDate("2026-13-40")).toBeNull();
    expect(parseSgDate("yesterday")).toBeNull();
  });

  it("makes a 24-hour day", () => {
    expect(dayRange(new Date("2026-11-01T16:00:00Z"))).toEqual({
      from: new Date("2026-11-01T16:00:00Z"),
      to: new Date("2026-11-02T16:00:00Z"),
    });
  });

  it("snaps any day to its Monday-to-Sunday week", () => {
    // Thursday 5 Nov 2026 -> Monday 2 Nov to Monday 9 Nov
    expect(weekRange(parseSgDate("2026-11-05")!)).toEqual({
      from: parseSgDate("2026-11-02"),
      to: parseSgDate("2026-11-09"),
    });
    // A Sunday belongs to the week that started the Monday before.
    expect(weekRange(parseSgDate("2026-11-08")!).from).toEqual(parseSgDate("2026-11-02"));
  });

  it("makes a calendar month and the one before it", () => {
    expect(monthRange("2026-01")).toEqual({
      from: parseSgDate("2026-01-01"),
      to: parseSgDate("2026-02-01"),
      previousFrom: parseSgDate("2025-12-01"),
    });
    expect(monthRange("2026-13")).toBeNull();
    expect(monthRange("Jan")).toBeNull();
  });
});
