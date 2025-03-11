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
    // Construct a broader search query
    const searchTerm = `${query} ${country} law legal regulations`;

    // For India, add specific legal terms
    if (country === "IN") {
      searchTerm += " Indian Constitution IPC civil criminal";
    }

    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*&srlimit=3`;

    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    const result = wikiSearchResponseSchema.safeParse(data);
    if (!result.success || result.data.query.search.length === 0) {
      return "I apologize, but I don't have enough information about this specific legal matter. Please consult a legal professional for accurate advice.";
    }

    // Combine information from multiple results
    const snippets = result.data.query.search
      .map(item => item.snippet)
      .map(snippet => snippet
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
      );

    // Create a coherent response
    const combinedInfo = snippets.join(" ");
    return formatLegalResponse(combinedInfo, country, query);
  } catch (error) {
    console.error("Error fetching legal information:", error);
    return "I apologize, but I'm unable to provide legal information at this time. Please try again later or consult a legal professional.";
  }
}

function formatLegalResponse(info: string, country: string, query: string): string {
  // Remove any mentions of Wikipedia or sources
  const cleanInfo = info
    .replace(/wikipedia|wiki|according to|source:|citation needed/gi, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const countryName = country === "IN" ? "India" : country;

  // Format as a natural response
  return `In ${countryName}, regarding your question about ${query.toLowerCase()}, here's what I found: ${cleanInfo}

Please note that this information is for general guidance only. Laws and regulations can change, and specific circumstances may vary. For definitive legal advice, please consult with a qualified legal professional.`;
}