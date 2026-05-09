import { Flex, Tooltip } from "antd";
import {
  BarChart3, FileSearch, GraduationCap, Home,
  LayoutGrid, MessageCircle, PersonStanding,
  ShoppingBag, TrendingUp, UserPlus, Users,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  accent?: boolean;
}

const topItems: NavItem[] = [
  { icon: Home,            label: "Início" },
  { icon: PersonStanding,  label: "Jornada" },
  { icon: ShoppingBag,     label: "Marketplace" },
  { icon: Users,           label: "Equipe" },
  { icon: TrendingUp,      label: "OKR" },
  { icon: BarChart3,       label: "Desempenho" },
  { icon: MessageCircle,   label: "Feedback" },
  { icon: UserPlus,        label: "Sucessão" },
  { icon: FileSearch,      label: "Pesquisa" },
  { icon: GraduationCap,   label: "Treinamento" },
];

const bottomItems: NavItem[] = [
  { icon: LayoutGrid, label: "Smartapps", accent: true },
];

interface IconSidebarProps {
  activeLabel?: string;
}

const IconSidebar = ({ activeLabel = "Início" }: IconSidebarProps) => (
  <Flex
    vertical
    justify="space-between"
    style={{ width: "100%", height: "100%", padding: "10px 4px", background: "#FFFFFF" }}
  >
    <Flex vertical gap={16} style={{ overflowY: "auto", overflowX: "hidden" }} className="thin-scrollbar">
      {topItems.map((item) => (
        <SidebarBtn key={item.label} item={item} active={item.label === activeLabel} />
      ))}
    </Flex>

    <Flex vertical gap={16} style={{ paddingTop: 8 }}>
      {bottomItems.map((item) => (
        <SidebarBtn key={item.label} item={item} active={item.label === activeLabel} />
      ))}
    </Flex>
  </Flex>
);

const SidebarBtn = ({ item, active }: { item: NavItem; active: boolean }) => {
  const iconStroke = active ? "#1570EF" : item.accent ? "#EF6820" : "#344054";
  const iconFill   = active ? "#EFF8FF" : item.accent ? "#FFF4ED" : "#EAECF0";
  const textColor  = active ? "#1570EF" : item.accent ? "#EF6820" : "#535862";
  const bgColor    = active ? "#EFF8FF" : "transparent";

  return (
    <Tooltip title={item.label} placement="right">
      <button
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "8px 2px 6px",
          gap: 3,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          background: bgColor,
          transition: "background 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!active)
            (e.currentTarget as HTMLButtonElement).style.background = item.accent ? "#FFF4ED" : "#F5F5F5";
        }}
        onMouseLeave={(e) => {
          if (!active)
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <item.icon
          size={18}
          strokeWidth={active ? 2.2 : 1.75}
          color={iconStroke}
          fill={iconFill}
        />
        <span style={{
          fontSize: 9,
          fontWeight: active ? 600 : 500,
          color: textColor,
          lineHeight: "11px",
          width: "100%",
          textAlign: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          letterSpacing: "-0.01em",
        }}>
          {item.label}
        </span>
      </button>
    </Tooltip>
  );
};

export default IconSidebar;
