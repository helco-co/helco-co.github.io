import {
  ArrowLeftRight,
  Bot,
  Briefcase,
  Building,
  Building2,
  Coins,
  Cpu,
  FileCheck,
  FileText,
  Globe,
  Handshake,
  Map,
  Scale,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Store,
  Target,
  TrendingUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Maps the icon names stored in services.json to their components. Explicit rather
 *  than a dynamic lookup so unused icons stay out of the bundle. */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Bot,
  Briefcase,
  Building,
  Building2,
  Coins,
  Cpu,
  FileCheck,
  FileText,
  Globe,
  Handshake,
  Map,
  Scale,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Store,
  Target,
  TrendingUp,
  TriangleAlert,
  Users,
};

export const iconFor = (name?: string): LucideIcon =>
  (name && SERVICE_ICONS[name]) || ShieldCheck;
