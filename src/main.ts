import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, Settings, SettingTab } from "settings";
import { registerTaskPlusIcon } from "icons";
import { CreateTaskFromSelectionCommand } from "commands/createTaskFromSelection";
import { TickTickClient } from "ticktickClient";

export default class TaskFromNotePlugin extends Plugin {
	settings: Settings;
	ticktick?: TickTickClient;

	async onload() {
		console.log("[TaskFromNote] loading plugin");

		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		if (this.settings.ticktickAccessToken) {
			this.ticktick = new TickTickClient(
				this.settings.ticktickAccessToken
			);
		}

		const createTaskCommand = new CreateTaskFromSelectionCommand(
			this,
			this.ticktick
		);
		createTaskCommand.register();

		registerTaskPlusIcon();

		this.addRibbonIcon("task-plus", "Create task from selection", () => {
			const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!mdView) return;

			const editor = mdView.editor;
			createTaskCommand.run(editor);
		});
	}

	onunload() {
		console.log("[TaskFromNote] unloading plugin");
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
