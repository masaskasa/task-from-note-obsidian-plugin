import { addIcon } from "obsidian";

const TASK_PLUS_SVG = `
<svg viewBox="0 0 24 24">
  <path
    d="M12 4v16M4 12h16"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

export function registerTaskPlusIcon() {
	addIcon("task-plus", TASK_PLUS_SVG);
}
