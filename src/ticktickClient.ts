import { requestUrl } from "obsidian";

const TICKTICK_API_BASE = "https://api.ticktick.com/open/v1";

export interface TickTickTaskInput {
	title: string;
	content?: string;
	projectId?: string;
}

export class TickTickClient {
	constructor(private accessToken: string) {}

	private async request<T>(path: string, options: RequestInit): Promise<T> {
		const url = `${TICKTICK_API_BASE}${path}`;

		const response = await requestUrl({
			url,
			method: options.method ?? "GET",
			body: options.body as string | ArrayBuffer | Uint8Array | undefined,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				"Content-Type": "application/json",
				...(options.headers as Record<string, string> | undefined),
			},
		});

		console.debug("[TaskFromNote] HTTP", response.status, "URL:", url);
		console.debug("[TaskFromNote] Request body:", options.body);
		console.debug("[TaskFromNote] Response text:", response.text);

		if (response.status >= 400) {
			const text = response.text;
			console.error(
				"[TaskFromNote] TickTick API error",
				response.status,
				text
			);
			throw new Error(`TickTick API error ${response.status}: ${text}`);
		}

		const data = response.json() as T;
		return data;
	}

	async createTask(task: TickTickTaskInput): Promise<TickTickTaskResponse> {
		const body = {
			title: task.title,
			content: task.content ?? "",
			projectId: task.projectId ?? "",
		};

		const res = await this.request<TickTickTaskResponse>("/task", {
			method: "POST",
			body: JSON.stringify(body),
		});

		console.debug("[TaskFromNote] TickTick createTask response:", res);
		return res;
	}
}

type TickTickTaskResponse = {
	id?: string;
	title?: string;
	content?: string;
	projectId?: string;
};
