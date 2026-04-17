import { useState } from "react";
import {
  X, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardList, ClipboardCheck, BarChart3, Target, UserCheck,
  Award, TrendingUp, FileBarChart, Tag,
} from "lucide-react";
import { Flex, Typography } from "antd";

interface PendenciaItem {
  id: string;
  title: string;
  sub: string;
  done?: boolean;
  iconColor: string;
  icon: React.ElementType;
}

const pendentes: PendenciaItem[] = [
  { id: "1", title: "Revisão de Metas",           sub: "Progresso da revisão · 2401 2001",          iconColor: "#3E4784", icon: Tag },
  { id: "2", title: "Avaliações de Desempenho",   sub: "Teste PDI no resultado · 2207 0505",         iconColor: "#BA24D5", icon: ClipboardCheck },
  { id: "3", title: "Pesquisa de Clima",           sub: "Relatório de performance · 2310 0105",       iconColor: "#E04F16", icon: BarChart3 },
  { id: "4", title: "Avaliação de Potencial",      sub: "Plano de desenvolvimento · 2311 0202",       iconColor: "#DD2590", icon: Target },
  { id: "5", title: "Autoavaliação Anual",         sub: "Questionário de desempenho · 2309 0102",     iconColor: "#CA8504", icon: UserCheck },
  { id: "6", title: "Avaliação de Competências",   sub: "Análise de metas · 2310 1212",               iconColor: "#088AB2", icon: Award },
  { id: "7", title: "Avaliação de Liderança",      sub: "Feedback 360° · 2309 1010",                  iconColor: "#E04F16", icon: TrendingUp },
  { id: "8", title: "Avaliação Trimestral",        sub: "Resultados da avaliação · 2308 1510",        iconColor: "#3E4784", icon: FileBarChart },
];

const concluidas: PendenciaItem[] = [
  { id: "c1", title: "Check-in Semestral",          sub: "Resultados do PDI · 2401 1515",                      done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c2", title: "Desenvolvimento de Carreira", sub: "Oportunidades de Crescimento · 2405 1550",            done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c3", title: "Planejamento Estratégico",    sub: "Metas e Objetivos · 2403 1530",                       done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c4", title: "Treinamento e Capacitação",   sub: "Programas de Formação · 2406 1560",                   done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c5", title: "Check-in Semestral",          sub: "Resultados do PDI · 2401 1515",                      done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c6", title: "Revisão Anual",               sub: "Avaliação de Desempenho · 2402 1520",                 done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c7", title: "Feedback 360°",               sub: "Análise de Competências · 2404 1540",                 done: true, iconColor: "#98A2B3", icon: ClipboardList },
  { id: "c8", title: "Avaliação de Satisfação",     sub: "Pesquisa de Clima Organizacional · 2407 1570",        done: true, iconColor: "#98A2B3", icon: ClipboardList },
];

const pages: (number | null)[] = [1, 2, 3, null, 8, 9, 10];

interface Props {
  open: boolean;
  onClose: () => void;
}

const PendenciasModal = ({ open, onClose }: Props) => {
  const [tab, setTab] = useState<"pendentes" | "concluidas">("pendentes");
  const [currentPage, setCurrentPage] = useState(1);

  if (!open) return null;

  const items = tab === "pendentes" ? pendentes : concluidas;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(10,13,18,0.7)",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001,
        width: 620,
        maxHeight: "90vh",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 24px 80px rgba(10,13,18,0.22)",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E9EAEB",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <Flex align="center" justify="space-between" style={{ padding: "20px 28px", borderBottom: "1px solid #E9EAEB" }}>
          <Flex align="center" gap={14}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#FEE4E2",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <AlertTriangle size={20} color="#D92D20" />
            </div>
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "26px" }}>
                Suas pendências
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#717680" }}>
                Resolva suas pendências
              </Typography.Text>
            </div>
          </Flex>
          <button onClick={onClose} style={iconBtnStyle}>
            <X size={18} color="#A4A7AE" />
          </button>
        </Flex>

        {/* ── Info row ── */}
        <Flex align="center" justify="space-between" style={{ padding: "10px 28px", background: "#FAFAFA", borderBottom: "1px solid #E9EAEB" }}>
          <Flex align="center" gap={8}>
            <CheckCircle2 size={15} color="#CAD5E2" />
            <Typography.Text style={{ fontSize: 13, color: "#667085" }}>
              Resolva suas pendências para manter o sistema atualizado
            </Typography.Text>
          </Flex>
          <span style={{
            fontSize: 12, fontWeight: 600, color: "#344054",
            background: "#fff", border: "1px solid #E9EAEB",
            padding: "3px 12px", borderRadius: 99,
          }}>
            Total: {pendentes.length + concluidas.length}
          </span>
        </Flex>

        {/* ── Tabs ── */}
        <Flex align="center" gap={0} style={{ padding: "0 28px", borderBottom: "1px solid #E9EAEB" }}>
          {(["pendentes", "concluidas"] as const).map((t) => {
            const isActive = tab === t;
            const label    = t === "pendentes" ? "Pendentes" : "Concluídos";
            const count    = t === "pendentes" ? pendentes.length : concluidas.length;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); setCurrentPage(1); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "14px 4px", marginRight: 24,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#101828" : "#717680",
                  borderBottom: isActive ? "2px solid #1570EF" : "2px solid transparent",
                  marginBottom: -1,
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {label}
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  background: isActive ? "#EFF8FF" : "#F2F4F7",
                  color: isActive ? "#1570EF" : "#717680",
                  borderRadius: 99, padding: "1px 7px", lineHeight: "18px",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </Flex>

        {/* ── List ── */}
        <div style={{ flex: 1, padding: "12px 20px", overflowY: "auto" }}>
          <div style={{ border: "1px solid #E9EAEB", borderRadius: 12, overflow: "hidden" }}>
            {items.map((item, i) => (
              <div key={item.id}>
                <Flex align="center" justify="space-between" style={{ padding: "20px 28px" }}>
                  <Flex align="center" gap={14} style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: item.done ? "#F2F4F7" : item.iconColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <item.icon size={20} color={item.done ? "#98A2B3" : "#fff"} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <Typography.Text style={{
                        fontSize: 14, fontWeight: 600, display: "block",
                        color: item.done ? "#98A2B3" : "#101828",
                        lineHeight: "22px",
                      }}>
                        {item.title}
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 12, color: "#A4A7AE" }}>
                        {item.sub}
                      </Typography.Text>
                    </div>
                  </Flex>
                  {!item.done && (
                    <button style={resolveBtnStyle}>Resolver</button>
                  )}
                  {item.done && (
                    <Typography.Text style={{
                      fontSize: 13, color: "#98A2B3", fontWeight: 400,
                      flexShrink: 0, marginLeft: 16,
                    }}>
                      Resolvido
                    </Typography.Text>
                  )}
                </Flex>
                {i < items.length - 1 && (
                  <div style={{ borderTop: "1px solid #F2F4F7" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" style={{ padding: "14px 28px", borderTop: "1px solid #E9EAEB" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{ ...pageBtnStyle, opacity: currentPage === 1 ? 0.4 : 1 }}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <Flex align="center" gap={2}>
            {pages.map((p, i) =>
              p === null ? (
                <span key={i} style={{ padding: "0 6px", color: "#717680", fontSize: 14 }}>…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit", border: "none",
                    background: currentPage === p ? "#F9FAFB" : "transparent",
                    color: currentPage === p ? "#101828" : "#717680",
                    fontWeight: currentPage === p ? 600 : 400,
                    outline: currentPage === p ? "1px solid #E9EAEB" : "none",
                  }}
                >
                  {p}
                </button>
              )
            )}
          </Flex>

          <button
            onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
            style={{ ...pageBtnStyle, opacity: currentPage === 10 ? 0.4 : 1 }}
            disabled={currentPage === 10}
          >
            Next <ChevronRight size={14} />
          </button>
        </Flex>
      </div>
    </>
  );
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 34, height: 34, background: "none", border: "none",
  cursor: "pointer", borderRadius: 8, padding: 0,
};
const resolveBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center",
  padding: "6px 14px", borderRadius: 8,
  border: "1px solid #D5D7DA", background: "#fff",
  cursor: "pointer", fontSize: 13, fontWeight: 500,
  color: "#344054", fontFamily: "inherit",
  boxShadow: "0 1px 2px rgba(10,13,18,0.05)",
  flexShrink: 0, marginLeft: 16,
  textDecoration: "none",
};
const pageBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 14px", borderRadius: 8,
  border: "1px solid #D5D7DA", background: "#fff",
  fontSize: 13, color: "#344054", fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit",
};

export default PendenciasModal;
