import { prohibitedKeywords } from "@/lib/constants";

export function screenListingContent(input: { title: string; description: string; tags: string[] }) {
  const haystack = `${input.title} ${input.description} ${input.tags.join(" ")}`.toLowerCase();
  const matches = prohibitedKeywords.filter((keyword) => haystack.includes(keyword));

  return {
    blocked: matches.length > 0,
    matches,
  };
}
