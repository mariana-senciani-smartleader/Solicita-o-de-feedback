import { useState } from "react";
import { Button, Flex, Input, Typography } from "antd";
import { ArrowDown, ArrowLeft, ArrowRight, FileText, Filter, Search } from "lucide-react";

const { Text } = Typography;

const sidebarItems = [
  { label: "Avaliações de Desempenho (2120)", badge: null },
  { label: "Avaliações de Eficácia (3)", badge: null },
  { label: "Avaliação Expressa (2235)", badge: null },
  { label: "Feedbacks Solicitados (106)", badge: null },
  { label: "Pesquisas com Planos de Ação (593)", badge: null },
  { label: "Pesquisas com Planos de Ação (6)", badge: null },
  { label: "Assinaturas de Feedback (79)", badge: null },
  { label: "Assinaturas de Avaliações – Individual (8)", badge: "2" },
  { label: "Assinaturas de Avaliações – Consolidado (91)", badge: null },
  { label: "Assinaturas de Avaliação Expressa (2)", badge: null },
];

const tableData = [
  { title: "Avaliações de Desempenho",   subtitle: "Texto PDI no resultado · 2207 0505",    date: "07/12/2023", participants: "10 users" },
  { title: "Feedback de Clientes",        subtitle: "Análise de Satisfação · 2207 0506",     date: "08/12/2023", participants: "150 responses" },
  { title: "Relatório Financeiro",        subtitle: "Revisão de Q4 · 2207 0507",             date: "09/12/2023", participants: "5 reports" },
  { title: "Progresso de Projetos",       subtitle: "Atualização Semanal · 2207 0508",       date: "10/12/2023", participants: "3 projects" },
  { title: "Reuniões de Equipe",          subtitle: "Planejamento Estratégico · 2207 0509",  date: "11/12/2023", participants: "8 participants" },
  { title: "Análise de Mercado",          subtitle: "Relatório Trimestral · 2207 0510",      date: "12/12/2023", participants: "20 analyses" },
  { title: "Desempenho de Vendas",        subtitle: "Relatório Mensal · 2207 0511",          date: "13/12/2023", participants: "15 products" },
  { title: "Treinamento de Funcionários", subtitle: "Sessão de Capacitação · 2207 0512",     date: "14/12/2023", participants: "25 participants" },
];

const AvatarStack = () => (
  <img src="/assets/avatars.svg" alt="Participantes" style={{ height: 28 }} />
);

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  background: "#F9FAFB",
  borderBottom: "1px solid #EAECF0",
  textAlign: "left",
  verticalAlign: "middle",
};

const tdStyle: React.CSSProperties = {
  padding: "0 16px",
  height: 72,
  borderBottom: "1px solid #E9EAEB",
  verticalAlign: "middle",
};

const GerenciarPendencias = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const pages = (() => {
    const p: (number | "...")[] = [1, 2, 3];
    if (totalPages > 6) p.push("...");
    if (totalPages > 3) p.push(totalPages - 2, totalPages - 1, totalPages);
    return p;
  })();

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", height: 28 }}>
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: "28px", color: "#344054", fontFamily: "Inter, sans-serif" }}>
          Gerenciar Pendências
        </span>
      </div>

      {/* Search + Smart Filter */}
      <Flex gap={20} align="center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar colaborador"
          prefix={<Search size={20} color="#667085" strokeWidth={1.67} />}
          style={{ width: 591, height: 40, borderRadius: 8, borderColor: "#D0D5DD", fontSize: 16 }}
          styles={{ input: { fontSize: 16, color: "#181D27" } }}
        />
        <Button
          icon={<Filter size={20} strokeWidth={1.67} color="#A4A7AE" />}
          style={{
            height: 36, borderRadius: 8, fontWeight: 600, fontSize: 14, color: "#414651",
            border: "1px solid #D5D7DA",
            boxShadow: "0px 1px 2px rgba(10,13,18,0.05), inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px rgba(10,13,18,0.05)",
          }}
        >
          Smart Filter
        </Button>
      </Flex>

      {/* Body: sidebar + table */}
      <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div style={{ width: 337, flexShrink: 0, display: "flex", flexDirection: "column", gap: 30 }}>
          {sidebarItems.map((item, idx) => {
            const isActive = activeItem === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveItem(idx)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "8px 12px", borderRadius: 6,
                  border: "none", cursor: "pointer",
                  background: isActive ? "#FAFAFA" : "transparent",
                  textAlign: "left", fontFamily: "Inter, sans-serif",
                  height: 36, boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px", color: isActive ? "#101828" : "#4A5565" }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span style={{
                    minWidth: 24, height: 22, padding: "2px 8px", borderRadius: 9999,
                    border: "1px solid #E9EAEB", background: "#FAFAFA",
                    fontSize: 12, fontWeight: 500, color: "#414651", lineHeight: "18px",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table + Pagination */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

          {/* Table */}
          <div style={{ border: "1px solid #E9EAEB", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "35%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={thStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 500, color: "#475467" }}>Nome</Text>
                      <ArrowDown size={14} strokeWidth={1.5} color="#475467" />
                    </div>
                  </th>
                  <th style={thStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 500, color: "#475467" }}>Criado em</Text>
                      <ArrowDown size={14} strokeWidth={1.5} color="#475467" />
                    </div>
                  </th>
                  <th style={thStyle}>
                    <Text style={{ fontSize: 12, fontWeight: 500, color: "#475467" }}>Participantes</Text>
                  </th>
                  <th style={thStyle}>
                    <Text style={{ fontSize: 12, fontWeight: 500, color: "#475467" }}>Notificar</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    {/* Nome */}
                    <td style={{ ...tdStyle, padding: "12px 17px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 9999, background: "#F4EBFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={20} color="#7F56D9" strokeWidth={2} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#101828", lineHeight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.title}</div>
                          <div style={{ fontSize: 14, fontWeight: 400, color: "#475467", lineHeight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    {/* Criado em */}
                    <td style={{ ...tdStyle, padding: "17px 16px", textAlign: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 500, color: "#4A5565", lineHeight: "24px" }}>{row.date}</span>
                    </td>
                    {/* Participantes */}
                    <td style={{ ...tdStyle, padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 400, color: "#475467", lineHeight: "20px", whiteSpace: "nowrap" }}>{row.participants}</span>
                        <AvatarStack />
                      </div>
                    </td>
                    {/* Notificar */}
                    <td style={{ ...tdStyle, padding: "17px 16px" }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, height: 60 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                color: "#535862", padding: 0,
              }}
            >
              <ArrowLeft size={20} strokeWidth={1.67} color="#A4A7AE" />
              Previous
            </button>

            <div style={{ display: "flex", gap: 2 }}>
              {pages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => typeof p === "number" && setCurrentPage(p)}
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: currentPage === p ? "#FAFAFA" : "transparent",
                    border: "none", cursor: typeof p === "number" ? "pointer" : "default",
                    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
                    color: currentPage === p ? "#414651" : "#717680",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                color: "#535862", padding: 0,
              }}
            >
              Next
              <ArrowRight size={20} strokeWidth={1.67} color="#A4A7AE" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenciarPendencias;
