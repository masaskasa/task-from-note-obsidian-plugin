import { App, PluginSettingTab, Setting, SecretComponent } from "obsidian";
import TaskFromNotePlugin from "main";

const DEFAULT_MODEL_NAME = "gpt-4o";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

export interface Settings {
	ticktickAccessToken: string;
	openaiApiKey: string;
	openaiModel: string;
	openaiBaseUrl: string;
}

export const DEFAULT_SETTINGS: Settings = {
	ticktickAccessToken: "",
	openaiApiKey: "",
	openaiModel: DEFAULT_MODEL_NAME,
	openaiBaseUrl: DEFAULT_BASE_URL,
};

export class SettingTab extends PluginSettingTab {
	plugin: TaskFromNotePlugin;

	constructor(app: App, plugin: TaskFromNotePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Warning banner
		const warningEl = containerEl.createEl("div", {
			cls: "task-from-note-settings-warning",
		});
		warningEl.createEl("strong", {
			text: "Note: ",
		});
		warningEl.createEl("span", {
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			text: "after changing these settings, use the Obsidian command ",
		});
		warningEl.createEl("strong", {
			text: "Reload app without saving",
		});
		warningEl.createEl("span", {
			text: " to fully apply changes",
		});
		containerEl.createEl("br");

		// eslint-disable-next-line obsidianmd/ui/sentence-case
		new Setting(containerEl).setName("TickTick settings").setHeading();

		const tokenSetting = new Setting(containerEl)

			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setName("TickTick access token")
			.setDesc("Paste your TickTick API access token")
			.addComponent((el) =>
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.ticktickAccessToken)
					.onChange((value) => {
						this.plugin.settings.ticktickAccessToken = value;
						this.plugin.saveSettings();
					})
			);
		tokenSetting.descEl.createEl("br");
		tokenSetting.descEl.createEl("a", {
			text: "Video guide: how to get your TickTick API token",
			href: "https://www.youtube.com/watch?v=4PERyNv8aYE",
		});

		new Setting(containerEl).setName("Chat model settings").setHeading();

		new Setting(containerEl)
			.setName("Model Name")
			.setDesc("Set model name")
			.addText((text) =>
				text
					.setPlaceholder("e.g. gpt-4o")
					.setValue(this.plugin.settings.openaiModel)
					.onChange(async (value) => {
						this.plugin.settings.openaiModel = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Base URL")
			.setDesc("Change if you using OpenAI‑compatible service")
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_BASE_URL)
					.setValue(this.plugin.settings.openaiBaseUrl)
					.onChange(async (value) => {
						this.plugin.settings.openaiBaseUrl = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("API Key")
			.setDesc("Enter API key")
			.addComponent((el) =>
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.openaiApiKey)
					.onChange((value) => {
						this.plugin.settings.openaiApiKey = value;
						this.plugin.saveSettings();
					})
			);
	}
}
