import { Editor, MarkdownView, Plugin, Notice } from "obsidian";
import { TickTickClient } from "ticktickClient";

export class CreateTaskFromSelectionCommand {
	constructor(
		private plugin: Plugin,
		private ticktick: TickTickClient | undefined
	) {}

	register() {
		this.plugin.addCommand({
			id: "create-task-from-selection",
			name: "Create task from selection",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.run(editor);
			},
		});
	}

	async run(editor: Editor) {
		const selection = editor.getSelection();
		console.log("[TaskFromNote] selected text:", selection);

		if (!selection) {
			new Notice("No text selected");
			return;
		}

		if (!this.ticktick) {
			new Notice(
				"TickTick is not configured. Get access token in plugin settings"
			);
			return;
		}

		try {
			const result = await this.ticktick.createTask({
				title: selection.slice(0, 100),
				content: selection,
			});
			console.log("[TaskFromNote] task successfully created:", result);
			new Notice("Task created in TickTick");
		} catch (e) {
			console.error("[TaskFromNote] TickTick createTask error", e);
			new Notice("Failed to create TickTick task, see console");
		}
	}
}
