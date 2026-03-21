import { requestUrl } from "obsidian";

export class OpenAIClient {
	constructor(
		private model: string,
		private baseURL: string,
		private apiKey: string
	) {}

	private async request<T>(path: string, options: RequestInit): Promise<T> {
		const url = `${this.baseURL}${path}`;

		const response = await requestUrl({
			url,
			method: options.method ?? "GET",
			body: options.body as string | ArrayBuffer | Uint8Array | undefined,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
				...(options.headers as Record<string, string> | undefined),
			},
			throw: false,
		});

		console.debug("[TaskFromNote] HTTP", response.status, "URL:", url);
		console.debug("[TaskFromNote] Request body:", options.body);
		console.debug("[TaskFromNote] Response text:", response.text);

		if (response.status >= 400) {
			const text = await response.text;
			console.error("[TaskFromNote] OpenAI error", response.status, text);
			throw new Error(`OpenAI error ${response.status}: ${text}`);
		}

		return response.json as Promise<T>;
	}

	async chat(prompt: string, systemPrompt: string): Promise<string> {
		const body = {
			model: this.model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: prompt },
			],
		};

		const res = await this.request<ChatCompletionResponse>(
			"/chat/completions",
			{
				method: "POST",
				body: JSON.stringify(body),
			}
		);

		console.debug("[TaskFromNote] OpenAI response:", res);

		const content = res.choices?.[0]?.message?.content;
		if (!content) {
			throw new Error(
				"[TaskFromNote] OpenAI response has no choices[0].message.content"
			);
		}

		return content;
	}
}

type ChatCompletionResponse = {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
};
