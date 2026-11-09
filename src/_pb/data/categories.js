import { RocketIcon, MegaphoneIcon, MicIcon, SearchPlusIcon } from "../components/icons.jsx";

export const CATEGORIES = [
  { key: "marketing", label: "שיווק", color: "#E0128B", tagText: "#B30C6E", iconBg: "rgba(224,18,139,0.10)", Icon: RocketIcon },
  { key: "sales", label: "מכירות", color: "#F68920", tagText: "#8A4300", iconBg: "rgba(246,137,32,0.14)", Icon: MegaphoneIcon },
  { key: "fundraising", label: "גיוס משקיעים", color: "#2B1A2E", tagText: "#2B1A2E", iconBg: "rgba(43,26,46,0.08)", Icon: MicIcon },
  { key: "refine", label: "שיפור וחידוד", color: "#5E4A5F", tagText: "#5E4A5F", iconBg: "rgba(94,74,95,0.10)", Icon: SearchPlusIcon },
];

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label || key;
}

export function categoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}
