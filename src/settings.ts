import { App, PluginSettingTab, Setting } from "obsidian";
import TaskFromNotePlugin from "./main";

export interface Settings {
	ticktickAccessToken: string;
}

export const DEFAULT_SETTINGS: Settings = {
	ticktickAccessToken: "",
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
	}
}
