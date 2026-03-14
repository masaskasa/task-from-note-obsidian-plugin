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

		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				"Content-Type": "application/json",
				...(options.headers || {}),
			},
		});

		if (!response.ok) {
			const text = await response.text();
			console.error("TickTick API error", response.status, text);
			throw new Error(`TickTick API error ${response.status}: ${text}`);
		}

		return response.json() as Promise<T>;
	}

	async createTask(task: TickTickTaskInput): Promise<any> {
		const body = {
			title: task.title,
			content: task.content ?? "",
			projectId: task.projectId ?? "",
		};

		const res = await this.request<any>("/task", {
			method: "POST",
			body: JSON.stringify(body),
		});

		console.log("[TaskFromNote] TickTick createTask response:", res);
		return res;
	}
}
