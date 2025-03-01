import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should properly combine class names", () => {
    // Test with simple string classes
    expect(cn("class1", "class2")).toBe("class1 class2");

    // Test with conditional classes
    expect(cn("base", true && "included", false && "excluded")).toBe(
      "base included",
    );

    // Test with object syntax
    expect(cn("base", { active: true, disabled: false })).toBe("base active");

    // Test with array
    expect(cn("base", ["array-item1", "array-item2"])).toBe(
      "base array-item1 array-item2",
    );

    // Test with a complex example
    const variant = "primary";
    const isActive = true;
    const isDisabled = false;

    expect(
      cn(
        "base-class",
        `variant-${variant}`,
        isActive && "active",
        isDisabled && "disabled",
        { "with-hover": !isDisabled, "no-events": isDisabled },
      ),
    ).toBe("base-class variant-primary active with-hover");
  });
});
