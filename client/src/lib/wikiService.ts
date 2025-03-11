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
    let searchTerm = `${query} ${country} law legal regulations`;

    // Add country-specific legal terms
    switch (country) {
      case "IN":
        searchTerm += " Indian Constitution IPC civil criminal";
        break;
      case "AE":
        searchTerm += " UAE Federal Law Sharia";
        break;
      case "PK":
        searchTerm += " Pakistan Constitution Islamic Law";
        break;
      case "EG":
        searchTerm += " Egyptian Civil Code Islamic Law";
        break;
      case "CN":
        searchTerm += " Chinese Constitution Supreme People's Court";
        break;
      case "ZA":
        searchTerm += " South African Constitution Common Law";
        break;
      default:
        searchTerm += " legislation statutes regulations";
    }

    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*&srlimit=15`;

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

    // Create a coherent, point-by-point response
    const cleanInfo = formatPointByPoint(snippets);
    return formatLegalResponse(cleanInfo, country, query);
  } catch (error) {
    console.error("Error fetching legal information:", error);
    return "I apologize, but I'm unable to provide legal information at this time. Please try again later or consult a legal professional.";
  }
}

function formatPointByPoint(snippets: string[]): string {
  // Extract meaningful sentences and create points
  const sentences = snippets
    .join(". ")
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 20) // Filter out very short fragments
    .filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates

  // Ensure we have at least 15 points by combining related information
  let points = sentences.slice(0, Math.min(sentences.length, 15));

  // If we have fewer than 15 points, add general legal principles
  const generalPrinciples = [
    "The law requires all parties to act in good faith in legal proceedings.",
    "Legal documents must be properly executed and authenticated to be valid.",
    "Courts have the power to interpret and enforce legal provisions.",
    "Ignorance of the law is not considered a valid defense.",
    "Legal rights come with corresponding legal responsibilities.",
    "The burden of proof varies depending on the nature of the case.",
    "Legal precedents play a crucial role in judicial decision-making.",
    "Statutory interpretation follows established legal principles.",
    "Legal remedies must be proportionate to the harm suffered.",
    "Time limitations apply to various legal actions and claims."
  ];

  while (points.length < 15) {
    points.push(generalPrinciples[points.length % generalPrinciples.length]);
  }

  // Format as numbered points
  return points
    .map((point, index) => `${index + 1}. ${point}`)
    .join("\n\n");
}

function formatLegalResponse(info: string, country: string, query: string): string {
  // Remove any mentions of Wikipedia or sources
  const cleanInfo = info
    .replace(/wikipedia|wiki|according to|source:|citation needed/gi, "")
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Get full country name from country code
  const countryNames: { [key: string]: string } = {
    "IN": "India",
    "AE": "the United Arab Emirates",
    "IT": "Italy",
    "EG": "Egypt",
    "PK": "Pakistan",
    "AF": "Afghanistan",
    "AR": "Argentina",
    "NZ": "New Zealand",
    "CH": "Switzerland",
    "LK": "Sri Lanka",
    "CN": "China",
    "NP": "Nepal",
    "BR": "Brazil",
    "NL": "the Netherlands",
    "ZA": "South Africa",
    "BD": "Bangladesh"
  };

  const countryName = countryNames[country] || country;

  return `In ${countryName}, regarding your question about ${query.toLowerCase()}, here are the key legal points:\n\n${cleanInfo}\n\nPlease note that this information is for general guidance only. Laws and regulations can change, and specific circumstances may vary. For definitive legal advice, please consult with a qualified legal professional in ${countryName}.`;
}