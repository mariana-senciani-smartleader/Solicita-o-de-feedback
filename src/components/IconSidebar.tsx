import { Flex, Tooltip } from "antd";
import {
  BarChart3, FileSearch, GraduationCap, Home,
  LayoutGrid, MessageCircle, PersonStanding,
  ShoppingBag, TrendingUp, UserPlus, Users,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  accent?: boolean;
}

const topItems: NavItem[] = [
  { icon: Home,            label: "Início",       active: true },
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

const IconSidebar = () => (
  <Flex
    vertical
    justify="space-between"
    style={{ width: "100%", height: "100%", padding: "10px 4px", background: "#FFFFFF" }}
  >
    <Flex vertical gap={16} style={{ overflowY: "auto", overflowX: "hidden" }} className="thin-scrollbar">
      {topItems.map((item) => (
        <SidebarBtn key={item.label} item={item} />
      ))}
    </Flex>

    <Flex vertical gap={16} style={{ paddingTop: 8 }}>
      {bottomItems.map((item) => (
        <SidebarBtn key={item.label} item={item} />
      ))}
    </Flex>
  </Flex>
);

const SidebarBtn = ({ item }: { item: NavItem }) => {
  const iconStroke = item.active ? "#1570EF" : item.accent ? "#EF6820" : "#344054";
  const iconFill   = item.active ? "#EFF8FF" : item.accent ? "#FFF4ED" : "#EAECF0";
  const textColor  = item.active ? "#1570EF" : item.accent ? "#EF6820" : "#535862";
  const bgColor    = item.active ? "#EFF8FF" : "transparent";

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
          if (!item.active)
            (e.currentTarget as HTMLButtonElement).style.background = item.accent ? "#FFF4ED" : "#F5F5F5";
        }}
        onMouseLeave={(e) => {
          if (!item.active)
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <item.icon
          size={18}
          strokeWidth={item.active ? 2.2 : 1.75}
          color={iconStroke}
          fill={iconFill}
        />
        <span style={{
          fontSize: 9,
          fontWeight: item.active ? 600 : 500,
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
