import { AlertTriangle, ChevronRight, ClipboardList, TrendingUp, Zap, PenLine, FileText } from "lucide-react";
import { Flex, Typography } from "antd";

const items = [
  {
    label: "Avaliação em massa",
    sub: "Av. em massa 2026",
    iconBg: "#F4F3FF",
    icon: <ClipboardList size={16} color="#7A5AF8" />,
  },
  {
    label: "Avaliação Formal",
    sub: "Av. Formal time de Suporte",
    iconBg: "#F4F3FF",
    icon: <ClipboardList size={16} color="#7A5AF8" />,
  },
  {
    label: "4 avaliações de eficácia pendentes",
    sub: null,
    iconBg: "#FFF1F3",
    icon: <TrendingUp size={16} color="#F63D68" />,
  },
  {
    label: "2 Avaliações expressas pendentes",
    sub: null,
    iconBg: "#FFFAEB",
    icon: <Zap size={16} color="#F79009" />,
  },
  {
    label: "31 assinaturas digitais pendentes",
    sub: null,
    iconBg: "#FEE4E2",
    icon: <PenLine size={16} color="#D92D20" />,
  },
  {
    label: "2 planos de ação para",
    sub: "Pesquisa de clima 2026",
    iconBg: "#EFF8FF",
    icon: <FileText size={16} color="#2E90FA" />,
  },
];

interface PendenciasWidgetProps {
  onViewAll?: () => void;
  style?: React.CSSProperties;
}

const PendenciasWidget = ({ onViewAll, style }: PendenciasWidgetProps) => (
  <div
    style={{
      width: 295,
      flexShrink: 0,
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #E9EAEB",
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(10,13,18,0.04)",
      ...style,
    }}
  >
    {/* Header */}
    <Flex align="center" gap={10} style={{ padding: "16px 16px 14px" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "#FEE4E2",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <AlertTriangle size={18} color="#D92D20" />
      </div>
      <Typography.Text strong style={{ fontSize: 15, color: "#181D27" }}>
        Suas pendências
      </Typography.Text>
    </Flex>

    <div style={{ borderTop: "1px solid #E9EAEB" }} />

    {/* Items */}
    <Flex vertical>
      {items.map((item, i) => (
        <div key={i}>
          <Flex
            align="center"
            justify="space-between"
            style={{ padding: "13px 16px", cursor: "pointer" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#FAFAFA")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <Flex align="center" gap={10} style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: item.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <Typography.Text style={{
                  fontSize: 13, color: "#414651", display: "block",
                  lineHeight: "18px", fontWeight: 500,
                }}>
                  {item.label}
                </Typography.Text>
                {item.sub && (
                  <Typography.Text style={{ fontSize: 12, color: "#717680", lineHeight: "17px", display: "block" }}>
                    {item.sub}
                  </Typography.Text>
                )}
              </div>
            </Flex>
            <ChevronRight size={16} color="#A4A7AE" style={{ flexShrink: 0, marginLeft: 6 }} />
          </Flex>
        </div>
      ))}
    </Flex>

    <div style={{ borderTop: "1px solid #E9EAEB" }} />

    {/* Footer button */}
    <div style={{ padding: "14px 16px" }}>
      <button
        onClick={onViewAll}
        style={{
          width: "100%", padding: "10px 0",
          border: "1px solid #D5D7DA", borderRadius: 8,
          background: "#fff", color: "#344054",
          fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 1px 2px rgba(10,13,18,0.05)",
        }}
      >
        Ver tudo
      </button>
    </div>
  </div>
);

export default PendenciasWidget;
