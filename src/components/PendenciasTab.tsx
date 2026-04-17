import { useState } from "react";
import {
  Search, SlidersHorizontal, ClipboardCheck, ClipboardList, BarChart3,
  Target, UserCheck, Award, TrendingUp, FileBarChart,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Bell, Eye,
} from "lucide-react";
import { Flex, Input, Typography } from "antd";
import SmartFilterDrawer from "./SmartFilterDrawer";

interface PendenciaRow {
  id: string;
  tipo: string;
  avaliacao: string;
  avaliacaoSub: string;
  criadoEm: string;
  respostas: number;
  status: "pendente" | "em_andamento" | "concluido";
  iconColor: string;
  icon: React.ElementType;
}

const rows: PendenciaRow[] = [
  { id: "1", tipo: "Desempenho",  avaliacao: "Avaliações de Desempenho", avaliacaoSub: "Teste PDI no resultado · 2207 0505", criadoEm: "07/12/2023", respostas: 150,  status: "pendente",     iconColor: "#6172F3", icon: ClipboardCheck },
  { id: "2", tipo: "Desempenho",  avaliacao: "Avaliações de Desempenho", avaliacaoSub: "Teste PDI no resultado · 2207 0505", criadoEm: "07/12/2023", respostas: 2235, status: "em_andamento", iconColor: "#BA24D5", icon: ClipboardList },
  { id: "3", tipo: "Clima",       avaliacao: "Pesquisa de Clima",          avaliacaoSub: "Relatório de performance · 2310 0105", criadoEm: "07/12/2023", respostas: 6,   status: "pendente",     iconColor: "#E04F16", icon: BarChart3 },
  { id: "4", tipo: "Potencial",   avaliacao: "Avaliação de Potencial",    avaliacaoSub: "Plano de desenvolvimento · 2311 0202", criadoEm: "07/12/2023", respostas: 106, status: "em_andamento", iconColor: "#DD2590", icon: Target },
  { id: "5", tipo: "Desempenho",  avaliacao: "Autoavaliação Anual",       avaliacaoSub: "Questionário de desempenho · 2309 0102", criadoEm: "07/12/2023", respostas: 3,  status: "pendente",     iconColor: "#CA8504", icon: UserCheck },
  { id: "6", tipo: "Competência", avaliacao: "Avaliação de Competências", avaliacaoSub: "Análise de metas · 2310 1212",         criadoEm: "07/12/2023", respostas: 593, status: "concluido",    iconColor: "#088AB2", icon: Award },
  { id: "7", tipo: "Liderança",   avaliacao: "Avaliação de Liderança",    avaliacaoSub: "Feedback 360° · 2309 1010",            criadoEm: "07/12/2023", respostas: 212, status: "em_andamento", iconColor: "#E04F16", icon: TrendingUp },
  { id: "8", tipo: "Trimestral",  avaliacao: "Avaliação Trimestral",      avaliacaoSub: "Resultados da avaliação · 2308 1510",  criadoEm: "07/12/2023", respostas: 79,  status: "pendente",     iconColor: "#3E4784", icon: FileBarChart },
];

const STATUS_MAP = {
  pendente:     { label: "Pendente",      bg: "#FEF3F2", color: "#B42318", dot: "#F04438" },
  em_andamento: { label: "Em andamento",  bg: "#FFFAEB", color: "#B54708", dot: "#F79009" },
  concluido:    { label: "Concluído",     bg: "#ECFDF3", color: "#067647", dot: "#17B26A" },
};

type SortCol = "avaliacao" | "criadoEm" | "respostas" | null;

const PendenciasTab = () => {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc(v => !v);
    else { setSortCol(col); setSortAsc(true); }
  };

  const filtered = rows.filter(
    r => r.avaliacao.toLowerCase().includes(search.toLowerCase()) || r.tipo.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        let cmp = 0;
        if (sortCol === "avaliacao") cmp = a.avaliacao.localeCompare(b.avaliacao);
        else if (sortCol === "criadoEm") cmp = a.criadoEm.localeCompare(b.criadoEm);
        else if (sortCol === "respostas") cmp = a.respostas - b.respostas;
        return sortAsc ? cmp : -cmp;
      })
    : filtered;

  const pages: (number | null)[] = [1, 2, 3, null, 8, 9, 10];

  const SortIcon = ({ col }: { col: SortCol }) =>
    sortCol === col
      ? sortAsc ? <ChevronDown size={13} /> : <ChevronUp size={13} />
      : <ChevronDown size={13} style={{ opacity: 0.3 }} />;

  return (
    <>
      <SmartFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", overflow: "hidden", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}>

        {/* ── Search bar ── */}
        <Flex align="center" gap={12} style={{ padding: "16px 24px", borderBottom: "1px solid #E9EAEB" }}>
          <Input
            prefix={<Search size={15} color="#A4A7AE" />}
            placeholder="Pesquisar pendência..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ flex: 1, maxWidth: 480, borderRadius: 8, height: 40 }}
          />
          <button onClick={() => setFilterOpen(true)} style={filterBtnStyle}>
            <SlidersHorizontal size={15} />
            Smart Filter
          </button>
        </Flex>

        {/* ── Table ── */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA" }}>
                <TH onClick={() => handleSort("avaliacao")} style={{ width: "35%" }}>
                  Avaliação <SortIcon col="avaliacao" />
                </TH>
                <TH style={{ width: "14%" }}>Tipo</TH>
                <TH onClick={() => handleSort("criadoEm")} style={{ width: "14%" }}>
                  Criado em <SortIcon col="criadoEm" />
                </TH>
                <TH onClick={() => handleSort("respostas")} style={{ width: "15%" }}>
                  Respostas <SortIcon col="respostas" />
                </TH>
                <TH style={{ width: "12%" }}>Status</TH>
                <TH style={{ width: "10%", textAlign: "right" }}>Ações</TH>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const st = STATUS_MAP[row.status];
                return (
                  <tr
                    key={row.id}
                    style={{ borderBottom: i < sorted.length - 1 ? "1px solid #F2F4F7" : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FAFBFC")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Avaliação */}
                    <td style={tdStyle}>
                      <Flex align="center" gap={12}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: row.iconColor + "14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <row.icon size={18} color={row.iconColor} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <Typography.Text style={{ fontSize: 13, color: "#101828", fontWeight: 600, display: "block", lineHeight: "20px" }}>
                            {row.avaliacao}
                          </Typography.Text>
                          <Typography.Text style={{ fontSize: 12, color: "#A4A7AE", lineHeight: "18px" }}>
                            {row.avaliacaoSub}
                          </Typography.Text>
                        </div>
                      </Flex>
                    </td>

                    {/* Tipo */}
                    <td style={tdStyle}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#344054", background: "#F2F4F7", padding: "3px 10px", borderRadius: 99 }}>
                        {row.tipo}
                      </span>
                    </td>

                    {/* Criado em */}
                    <td style={tdStyle}>
                      <Typography.Text style={{ fontSize: 13, color: "#344054" }}>{row.criadoEm}</Typography.Text>
                    </td>

                    {/* Respostas */}
                    <td style={tdStyle}>
                      <Typography.Text style={{ fontSize: 13, color: "#101828", fontWeight: 600, display: "block" }}>
                        {row.respostas.toLocaleString("pt-BR")}
                      </Typography.Text>
                      <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 12, color: "#1570EF", fontFamily: "inherit" }}>
                        Ver detalhes
                      </button>
                    </td>

                    {/* Status */}
                    <td style={tdStyle}>
                      <Flex align="center" gap={6}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: st.color }}>{st.label}</span>
                      </Flex>
                    </td>

                    {/* Ações */}
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <Flex gap={4} justify="flex-end">
                        <button style={actionIconStyle} title="Notificar"><Bell size={14} color="#667085" /></button>
                        <button style={actionIconStyle} title="Ver detalhes"><Eye size={14} color="#667085" /></button>
                      </Flex>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <Flex align="center" justify="space-between" style={{ padding: "14px 24px", borderTop: "1px solid #E9EAEB" }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} style={{ ...pageBtnStyle, opacity: currentPage === 1 ? 0.4 : 1 }} disabled={currentPage === 1}>
            <ChevronLeft size={14} /> Previous
          </button>
          <Flex align="center" gap={2}>
            {pages.map((p, i) =>
              p === null
                ? <span key={i} style={{ padding: "0 6px", color: "#717680", fontSize: 14 }}>…</span>
                : <button key={p} onClick={() => setCurrentPage(p!)} style={{ ...pageNumStyle, background: currentPage === p ? "#F5F8FF" : "transparent", color: currentPage === p ? "#1570EF" : "#717680", fontWeight: currentPage === p ? 600 : 400, border: currentPage === p ? "1px solid #B2DDFF" : "1px solid transparent" }}>{p}</button>
            )}
          </Flex>
          <button onClick={() => setCurrentPage(p => Math.min(10, p + 1))} style={{ ...pageBtnStyle, opacity: currentPage === 10 ? 0.4 : 1 }} disabled={currentPage === 10}>
            Next <ChevronRight size={14} />
          </button>
        </Flex>
      </div>
    </>
  );
};

const TH = ({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) => (
  <th style={{ padding: "12px 24px", textAlign: "left", borderBottom: "1px solid #E9EAEB", fontSize: 12, fontWeight: 500, color: "#717680", whiteSpace: "nowrap", cursor: onClick ? "pointer" : "default", userSelect: "none", ...style }} onClick={onClick}>
    <Flex align="center" gap={4} style={{ display: "inline-flex" }}>{children}</Flex>
  </th>
);

const tdStyle: React.CSSProperties = { padding: "14px 24px", verticalAlign: "middle" };
const filterBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, color: "#344054", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" };
const actionIconStyle: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, border: "1px solid #E9EAEB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" };
const pageBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, color: "#344054", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" };
const pageNumStyle: React.CSSProperties = { width: 36, height: 36, borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" };

export default PendenciasTab;
