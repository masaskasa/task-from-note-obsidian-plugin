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
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- This text is intentionally lowercase as it continues the sentence started by "Note: ". The full sentence structure requires lowercase continuation.
			text: "after changing these settings, use the Obsidian command ",
		});
		warningEl.createEl("strong", {
			text: "Reload app without saving", // This is an exact Obsidian command name that must preserve its original capitalization
		});
		warningEl.createEl("span", {
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- This text is intentionally lowercase as it completes the sentence. Making it sentence case would break the grammatical flow.
			text: " to fully apply changes",
		});
		containerEl.createEl("br");

		// eslint-disable-next-line obsidianmd/ui/sentence-case -- "TickTick" is a third-party service name that must preserve its original capitalization (TickTick, not Ticktick).
		new Setting(containerEl).setName("TickTick").setHeading();

		const tokenSetting = new Setting(containerEl)

			// eslint-disable-next-line obsidianmd/ui/sentence-case -- "TickTick" is a third-party service name that must preserve its original capitalization (TickTick, not Ticktick).
			.setName("TickTick access token")
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- "TickTick" is a third-party service name that must preserve its original capitalization (TickTick, not Ticktick).
			.setDesc("Paste your TickTick API access token")
			.addComponent((el) =>
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.ticktickAccessToken)
					.onChange(async (value) => {
						this.plugin.settings.ticktickAccessToken = value;
						await this.plugin.saveSettings();
					})
			);
		tokenSetting.descEl.createEl("br");
		tokenSetting.descEl.createEl("a", {
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- "TickTick" is a third-party service name that must preserve its original capitalization (TickTick, not Ticktick).
			text: "Video guide: how to get your TickTick API token",
			href: "https://www.youtube.com/watch?v=4PERyNv8aYE",
		});

		new Setting(containerEl).setName("Chat model").setHeading();

		new Setting(containerEl)
			.setName("Model name")
			.setDesc("Set model name")
			.addText((text) =>
				text
					// eslint-disable-next-line obsidianmd/ui/sentence-case -- "GPT-4o" is the official OpenAI model name, must preserve original capitalization.
					.setPlaceholder("GPT-4o")
					.setValue(this.plugin.settings.openaiModel)
					.onChange(async (value) => {
						this.plugin.settings.openaiModel = value.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Base URL")
			// eslint-disable-next-line obsidianmd/ui/sentence-case -- This description contains "OpenAI‑compatible" which is a technical term that should preserve its hyphenation and capitalization.
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
			.setName("API key")
			.setDesc("Enter API key")
			.addComponent((el) =>
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.openaiApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openaiApiKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
