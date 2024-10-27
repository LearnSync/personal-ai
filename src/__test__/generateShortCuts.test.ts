import { generateShortCuts } from "@/constants";
import { Platform } from "@/core";

describe("generateShortCuts", () => {
  it("should include ctrl and shift when both are true", () => {
    const key = "c";
    const shortcuts = generateShortCuts({ key, ctrl: true, shift: true });

    expect(shortcuts).toEqual([
      { key: Platform.Windows, modifiers: ["ctrl", "shift", "c"] },
      { key: Platform.Mac, modifiers: ["cmd", "shift", "c"] },
      { key: Platform.Linux, modifiers: ["ctrl", "shift", "c"] },
    ]);
  });

  it("should exclude ctrl when ctrl is false", () => {
    const key = "f";
    const shortcuts = generateShortCuts({ key, ctrl: false, shift: true });

    expect(shortcuts).toEqual([
      { key: Platform.Windows, modifiers: ["shift", "f"] },
      { key: Platform.Mac, modifiers: ["shift", "f"] },
      { key: Platform.Linux, modifiers: ["shift", "f"] },
    ]);
  });

  it("should exclude shift when shift is false", () => {
    const key = "i";
    const shortcuts = generateShortCuts({ key, ctrl: true, shift: false });

    expect(shortcuts).toEqual([
      { key: Platform.Windows, modifiers: ["ctrl", "i"] },
      { key: Platform.Mac, modifiers: ["cmd", "i"] },
      { key: Platform.Linux, modifiers: ["ctrl", "i"] },
    ]);
  });

  it("should exclude both ctrl and shift when both are false", () => {
    const key = "x";
    const shortcuts = generateShortCuts({ key, ctrl: false, shift: false });

    expect(shortcuts).toEqual([
      { key: Platform.Windows, modifiers: ["x"] },
      { key: Platform.Mac, modifiers: ["x"] },
      { key: Platform.Linux, modifiers: ["x"] },
    ]);
  });

  it("should generate correct shortcuts with default ctrl and shift as true", () => {
    const key = "s";
    const shortcuts = generateShortCuts({ key });

    expect(shortcuts).toEqual([
      { key: Platform.Windows, modifiers: ["ctrl", "shift", "s"] },
      { key: Platform.Mac, modifiers: ["cmd", "shift", "s"] },
      { key: Platform.Linux, modifiers: ["ctrl", "shift", "s"] },
    ]);
  });
});
