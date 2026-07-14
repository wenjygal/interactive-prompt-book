import { RocketIcon, MegaphoneIcon, MicIcon, SearchPlusIcon } from "../components/icons.jsx";

export const CATEGORIES = [
  { key: "marketing", label: "שיווק", color: "#F97316", tagText: "#C2410C", iconBg: "rgba(249,115,22,0.12)", Icon: RocketIcon },
  { key: "sales", label: "מכירות", color: "#F59E0B", tagText: "#B45309", iconBg: "rgba(245,158,11,0.12)", Icon: MegaphoneIcon },
  { key: "fundraising", label: "גיוס משקיעים", color: "#0EA5E9", tagText: "#0369A1", iconBg: "rgba(14,165,233,0.12)", Icon: MicIcon },
  { key: "refine", label: "שיפור וחידוד", color: "#22C55E", tagText: "#15803D", iconBg: "rgba(34,197,94,0.12)", Icon: SearchPlusIcon },
];

export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label || key;
}

export function categoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}
