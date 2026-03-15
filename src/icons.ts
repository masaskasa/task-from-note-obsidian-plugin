import { addIcon } from "obsidian";

const TASK_PLUS_SVG = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <!-- note with folded corner -->
  <path
    d="M5 4h9l5 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z
       M14 4v5h5"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="round"
    stroke-linecap="round"
  />

  <!-- plus visually centered inside the note (slightly left) -->
  <line
    x1="11"
    y1="10"
    x2="11"
    y2="16"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
  <line
    x1="8"
    y1="13"
    x2="14"
    y2="13"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>
`;

export function registerTaskPlusIcon() {
	addIcon("task-plus", TASK_PLUS_SVG);
}
