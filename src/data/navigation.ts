import type { NavigationItem } from "@/types/portfolio";

export const navigationItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Impact", href: "#impact" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Connect", href: "#connect" },
] as const satisfies readonly NavigationItem[];
