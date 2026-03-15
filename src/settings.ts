import { App, PluginSettingTab, Setting } from "obsidian";
import TaskFromNotePlugin from "./main";

export interface Settings {
	ticktickAccessToken: string;
	openaiApiKey: string;
	openaiModel: string;
	openaiBaseUrl: string;
}

export const DEFAULT_SETTINGS: Settings = {
	ticktickAccessToken: "",
	openaiApiKey: "",
	openaiModel: "gpt-4o",
	openaiBaseUrl: "https://api.openai.com/v1",
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
		containerEl.createEl("h2", { text: "Task From Note Settings" });

		new Setting(containerEl)
			.setName("TickTick Access Token")
			.setDesc("Paste your TickTick API access token (Bearer)")
			.addText((text) =>
				text
					.setPlaceholder("xxx...")
					.setValue(this.plugin.settings.ticktickAccessToken)
					.onChange(async (value) => {
						this.plugin.settings.ticktickAccessToken = value.trim();
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "Chat Model Settings" });

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
					.setPlaceholder("https://api.openai.com/v1")
					.setValue(this.plugin.settings.openaiBaseUrl)
					.onChange(async (value) => {
						this.plugin.settings.openaiBaseUrl = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("API Key")
			.setDesc("Enter API key")
			.addText((text) =>
				text
					.setPlaceholder("xxx...")
					.setValue(this.plugin.settings.openaiApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openaiApiKey = value.trim();
						await this.plugin.saveSettings();
					})
			);
	}
}
