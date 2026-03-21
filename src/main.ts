import { MarkdownView, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, Settings, SettingTab } from "settings";
import { registerTaskPlusIcon } from "icons";
import { CreateTaskFromSelectionCommand } from "commands/createTaskFromSelection";
import { TickTickClient } from "ticktickClient";
import { OpenAIClient } from "openaiClient";

export default class TaskFromNotePlugin extends Plugin {
	settings: Settings = DEFAULT_SETTINGS;
	ticktick?: TickTickClient;
	openai?: OpenAIClient;

	async onload() {
		console.debug("[TaskFromNote] loading plugin");

		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		const ticktickAccessToken = this.app.secretStorage.getSecret(
			this.settings.ticktickAccessToken
		);
		if (ticktickAccessToken) {
			this.ticktick = new TickTickClient(ticktickAccessToken);
		}

		const openaiApiKey = this.app.secretStorage.getSecret(
			this.settings.openaiApiKey
		);
		if (openaiApiKey) {
			this.openai = new OpenAIClient(
				this.settings.openaiModel,
				this.settings.openaiBaseUrl,
				openaiApiKey
			);
		}

		const createTaskCommand = new CreateTaskFromSelectionCommand(
			this,
			this.ticktick,
			this.openai
		);
		createTaskCommand.register();

		registerTaskPlusIcon();

		this.addRibbonIcon(
			"task-plus",
			"Create task from selection",
			async () => {
				const mdView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!mdView) return;

				const editor = mdView.editor;
				await createTaskCommand.run(editor);
			}
		);
	}

	onunload() {
		console.debug("[TaskFromNote] unloading plugin");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<Settings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
