import config from "../config";
import { prompt } from "../propmpts/textFormater";

export async function formatNoteWithPerplexity(rawText: string) {
	if (!config.PERPLEXITY_API_KEY) {
		console.log("No Perplexity API key found — skipping formatting.");
		return rawText;
	}

	try {
		const res = await fetch("https://api.perplexity.ai/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.PERPLEXITY_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "sonar",
				messages: [
					{
						role: "system",
						content: `${prompt}`,
					},
					{ role: "user", content: rawText },
				],
				max_tokens: 1000,
			}),
		});

		if (!res.ok) {
			throw new Error(`Perplexity API error: ${res.statusText}`);
		}

		const data = await res.json();
		return data?.choices?.[0]?.message?.content || rawText;
	} catch (error) {
		console.error("Error calling Perplexity API:", error);
		return rawText;
	}
}
