import { describe, expect, it } from "vitest";

import { screenListingContent } from "@/lib/moderation";

describe("screenListingContent", () => {
  it("flags prohibited keywords", () => {
    const result = screenListingContent({
      title: "Antique gun collection",
      description: "Very rare firearm piece.",
      tags: ["collectible"],
    });

    expect(result.blocked).toBe(true);
    expect(result.matches).toContain("gun");
  });

  it("allows normal marketplace content", () => {
    const result = screenListingContent({
      title: "Used study desk",
      description: "Teak desk in good condition with two drawers.",
      tags: ["desk", "wood"],
    });

    expect(result.blocked).toBe(false);
    expect(result.matches).toHaveLength(0);
  });
});
