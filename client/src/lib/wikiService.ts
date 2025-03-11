import { z } from "zod";

const wikiSearchResponseSchema = z.object({
  query: z.object({
    search: z.array(z.object({
      title: z.string(),
      snippet: z.string(),
      pageid: z.number()
    }))
  })
});

export async function searchWikipedia(query: string, country: string): Promise<string> {
  try {
    const searchTerm = `${query} ${country} law legal`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const result = wikiSearchResponseSchema.safeParse(data);
    if (!result.success || result.data.query.search.length === 0) {
      return "No relevant legal information found.";
    }

    // Get the first result and clean up the HTML tags from the snippet
    const firstResult = result.data.query.search[0];
    const cleanSnippet = firstResult.snippet
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return `According to Wikipedia: ${cleanSnippet}`;
  } catch (error) {
    console.error("Error fetching from Wikipedia:", error);
    return "Unable to fetch legal information at this time.";
  }
}
