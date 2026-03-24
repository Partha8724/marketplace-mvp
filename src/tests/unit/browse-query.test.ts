import { describe, expect, it } from "vitest";

import { buildBrowseWhere } from "@/lib/queries/listings";

describe("buildBrowseWhere", () => {
  it("combines keyword, city, and price filters", () => {
    const where = buildBrowseWhere({
      q: "iphone",
      city: "Bengaluru",
      minPrice: 1000,
      maxPrice: 2000,
    }) as Record<string, unknown>;

    expect(where.city).toEqual({ equals: "Bengaluru", mode: "insensitive" });
    expect(where.price).toEqual({ gte: 1000, lte: 2000 });
    expect(where.OR).toBeTruthy();
  });
});
