import {
  ActivityIcon,
  AppleIcon,
  DumbbellIcon,
  LayoutDashboardIcon,
  RulerIcon,
  ScaleIcon,
  SportShoeIcon,
  WeightIcon,
} from "lucide-react";

export const navLinks = [
  { to: "/", label: "Home", icon: LayoutDashboardIcon },
  { to: "/exercises", label: "Exercises", icon: DumbbellIcon },
  { to: "/workouts", label: "Workouts", icon: WeightIcon },
  { to: "/my-logs", label: "Logs", icon: SportShoeIcon },
  { to: "/sleep", label: "Sleep", icon: ActivityIcon },
  { to: "/nutrition", label: "Nutrition", icon: AppleIcon },
  { to: "/weight", label: "Weight", icon: ScaleIcon },
  { to: "/measurements", label: "Measurements", icon: RulerIcon },
] as const;
