import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Avatar, Checkbox, Select } from "antd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { avatar } from '@/lib/avatar';

/* ── Data ── */

interface Collaborator {
  id: string;
  name: string;
  role: string;
  area: string;
  unit: string;
  avatar: string;
}

const ALL_COLLABORATORS: Collaborator[] = [
  { id: "1",  name: "Olívia Rhye",       role: "Product Design Lead",      area: "Design",           unit: "São Paulo - Morumbi",          avatar: avatar("Olívia Rhye") },
  { id: "2",  name: "Sofia Martinez",    role: "UX Researcher",            area: "User Insights",    unit: "Manaus - Adrianópolis",         avatar: avatar("Sofia Martinez") },
  { id: "3",  name: "Liam Chen",         role: "Visual Designer",          area: "Branding",         unit: "Recife - Boa Viagem",           avatar: avatar("Liam Chen") },
  { id: "4",  name: "Amira Hassan",      role: "Interaction Designer",     area: "Mobile Apps",      unit: "Fortaleza - Meireles",          avatar: avatar("Amira Hassan") },
  { id: "5",  name: "Carlos Gómez",      role: "Front-end Developer",      area: "React Specialist", unit: "Salvador - Barra",              avatar: avatar("Carlos Gómez") },
  { id: "6",  name: "Nina Patel",        role: "Content Strategist",       area: "UX Writing",       unit: "Porto Alegre - Moinhos de Vento", avatar: avatar("Nina Patel") },
  { id: "7",  name: "Ethan Johnson",     role: "Data Analyst",             area: "User Behavior",    unit: "Belo Horizonte - Savassi",      avatar: avatar("Ethan Johnson") },
  { id: "8",  name: "Julie Tanaka",      role: "Accessibility Expert",     area: "Inclusive Design", unit: "Rio de Janeiro - Copacabana",   avatar: avatar("Julie Tanaka") },
  { id: "9",  name: "Marie Dubois",      role: "Prototyper",               area: "Rapid Iteration",  unit: "São Paulo - Morumbi",          avatar: avatar("Marie Dubois") },
  { id: "10", name: "Omar Al-Farsi",     role: "Design Systems Manager",   area: "UI Components",    unit: "Brasília - Asa Sul",            avatar: avatar("Omar Al-Farsi") },
  { id: "11", name: "Clara Svensson",    role: "Service Designer",         area: "Customer Experience", unit: "Curitiba - Batel",           avatar: avatar("Clara Svensson") },
  { id: "12", name: "Bruno Delorence",   role: "Product Design Lead",      area: "Design",           unit: "São Paulo - Morumbi",          avatar: avatar("Bruno Delorence") },
  { id: "13", name: "Lucia Fernández",   role: "UX Lead",                  area: "Research",         unit: "São Paulo - Morumbi",          avatar: avatar("Lucia Fernández") },
  { id: "14", name: "Carlos Méndez",     role: "Frontend Developer",       area: "Desenvolvimento",  unit: "Rio de Janeiro - Copacabana",   avatar: avatar("Carlos Méndez") },
  { id: "15", name: "Ana Gómez",         role: "Product Manager",          area: "Gestão",           unit: "São Paulo - Morumbi",          avatar: avatar("Ana Gómez") },
];

const FILTER_SECTIONS = [
  { key: "regional",       label: "Regional" },
  { key: "unidades",       label: "Unidades" },
  { key: "diretoria",      label: "Diretoria" },
  { key: "area",           label: "Área" },
  { key: "cargo",          label: "Cargo chave" },
  { key: "nivel",          label: "Nível de Importância" },
  { key: "especificidade", label: "Nível de Especificidade" },
  { key: "impacto",        label: "Impacto da perda" },
  { key: "sucessores",     label: "Sucessores" },
];

const PAGE_SIZE = 11;

interface AddMembersStepProps {
  channelName: string;
  onBack: () => void;
  onCreate: () => void;
}

export function AddMembersStep({ onBack, onCreate }: AddMembersStepProps) {
  const [search, setSearch]           = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [roles, setRoles]             = useState<Record<string, "Membro" | "Moderador">>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllRight, setSelectAllRight] = useState(false);

  /* ── Filtering / pagination ── */
  const filtered = useMemo(() =>
    ALL_COLLABORATORS.filter((c) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      );
    }),
    [search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const addedList = useMemo(
    () => ALL_COLLABORATORS.filter((c) => selectedIds.includes(c.id)),
    [selectedIds]
  );

  const filteredRight = useMemo(() => {
    const q = rightSearch.trim().toLowerCase();
    if (!q) return addedList;
    return addedList.filter(c =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }, [addedList, rightSearch]);

  /* ── Actions ── */
  const toggleOne = (id: string) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((i) => i !== id) : [...p, id]));

  const setRole = (id: string, role: "Membro" | "Moderador") =>
    setRoles((p) => ({ ...p, [id]: role }));

  const clearFilters = () => setSearch("");

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((r) => selectedIds.includes(r.id));

  const handleSelectAllPage = () => {
    if (allOnPageSelected) {
      setSelectedIds((p) => p.filter((id) => !paginated.find((r) => r.id === id)));
    } else {
      setSelectedIds((p) => [...new Set([...p, ...paginated.map((r) => r.id)])]);
    }
  };

  const pageNums: (number | "...")[] = [1, 2, 3, "...", 8, 9, 10];

  return (
    <div style={{
      display: "flex", flexDirection: "column", width: "100%", height: "100%",
      minHeight: 0, flex: "1 1 0%", background: "#fff", fontFamily: "'Inter', sans-serif",
    }}>

      {/* ─── Header ─── */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#101828", margin: 0 }}>
          Adicionar membros
        </h2>
      </div>

      {/* ─── Body ─── */}
      <div style={{ display: "flex", flex: "1 1 0%", minHeight: 0, overflow: "hidden" }}>

        {/* ── LEFT: Smart Filter ── */}
        <div style={{
          width: 200, flexShrink: 0, borderRight: "1px solid #E9EAEB",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#181D27", margin: 0 }}>
              Smart Filter
            </h3>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {FILTER_SECTIONS.map((s) => (
              <button
                key={s.key}
                style={{
                  width: "100%", display: "block", padding: "9px 20px",
                  fontSize: 13, fontWeight: 400, textAlign: "left", fontFamily: "inherit",
                  color: "#414651", background: "transparent",
                  border: "none", cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Filter footer */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #E9EAEB", flexShrink: 0 }}>
            <button
              onClick={clearFilters}
              style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                fontWeight: 500, color: "#667085", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <RotateCcw size={14} />
              Limpar filtros
            </button>
          </div>
        </div>

        {/* ── CENTER: Collaborator Table ── */}
        <div style={{
          flex: "1 1 0%", minWidth: 0, display: "flex", flexDirection: "column",
          borderRight: "1px solid #E9EAEB", overflow: "hidden",
        }}>

          {/* Search */}
          <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              border: "1px solid #D5D7DA", borderRadius: 8, padding: "8px 12px",
              background: "#fff",
            }}>
              <Search size={15} color="#A4A7AE" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar colaboradores..."
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 14, color: "#344054", fontFamily: "inherit",
                  background: "transparent",
                }}
              />
            </div>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 140px 180px 40px",
            gap: 8, alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #E9EAEB",
            fontSize: 12, fontWeight: 500, color: "#717680",
            flexShrink: 0, marginTop: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={allOnPageSelected}
                indeterminate={!allOnPageSelected && paginated.some(r => selectedIds.includes(r.id))}
                onChange={handleSelectAllPage}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              Colaborador <ArrowDown />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              Tipo <ArrowDown />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              Unidade <ArrowDown />
            </div>
            <span style={{ color: "#717680" }}>Ações</span>
          </div>

          {/* Rows */}
          <ScrollArea style={{ flex: "1 1 0%", minHeight: 0, overflow: "auto" }}>
            {paginated.map((row) => {
              const isSelected = selectedIds.includes(row.id);
              const role       = roles[row.id] ?? "Membro";
              return (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr 140px 180px 40px",
                    gap: 8, alignItems: "center",
                    padding: "10px 20px",
                    borderBottom: "1px solid #F2F4F7",
                    cursor: "pointer",
                    background: isSelected ? "#F5F8FF" : undefined,
                    transition: "background 0.12s",
                  }}
                  onClick={() => toggleOne(row.id)}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#FAFAFA"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = isSelected ? "#F5F8FF" : "transparent"; }}
                >
                  {/* Checkbox */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onChange={() => toggleOne(row.id)} />
                  </div>

                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Avatar src={row.avatar} size={36} style={{ flexShrink: 0, border: "1px solid #EAECF0" }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#101828", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#667085", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {row.role}, {row.area}
                      </p>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={role}
                      onChange={(v) => setRole(row.id, v as "Membro" | "Moderador")}
                      style={{ width: 124 }}
                      size="small"
                      options={[
                        { value: "Membro",    label: "Membro" },
                        { value: "Moderador", label: "Moderador" },
                      ]}
                    />
                  </div>

                  {/* Unidade */}
                  <p style={{ fontSize: 13, color: "#535862", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {row.unit}
                  </p>

                  {/* Add icon */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleOne(row.id); }}
                    style={{
                      width: 30, height: 30, borderRadius: 15,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer",
                      color: isSelected ? "#1570EF" : "#A4A7AE", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1570EF"; e.currentTarget.style.background = "#EFF8FF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = isSelected ? "#1570EF" : "#A4A7AE"; e.currentTarget.style.background = "none"; }}
                  >
                    <UserPlus size={15} strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </ScrollArea>

          {/* Pagination */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderTop: "1px solid #E9EAEB", flexShrink: 0,
          }}>
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={paginatorBtnStyle(currentPage <= 1)}
            >
              <ArrowLeft size={14} /> Anterior
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {pageNums.map((p, i) => (
                <button
                  key={i}
                  disabled={p === "..."}
                  onClick={() => p !== "..." && setCurrentPage(p as number)}
                  style={{
                    width: 30, height: 30, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                    border: "none", cursor: p === "..." ? "default" : "pointer",
                    color: p === "..." ? "#A4A7AE" : p === currentPage ? "#101828" : "#667085",
                    background: p === currentPage ? "#F2F4F7" : "transparent",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={paginatorBtnStyle(currentPage >= totalPages)}
            >
              Próximo <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Members panel ── */}
        <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          {addedList.length === 0 ? (
            /* ── Empty state ── */
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "32px 24px", textAlign: "center",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12, background: "#F9FAFB",
                border: "1px solid #E9EAEB",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <User size={26} strokeWidth={1.5} color="#A4A7AE" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#181D27", margin: "0 0 8px" }}>
                Sem membros no canal
              </p>
              <p style={{ fontSize: 13, color: "#717680", margin: 0, lineHeight: 1.6 }}>
                Selecione os colaboradores ao lado que irão participar deste canal
              </p>
            </div>
          ) : (
            /* ── Selected state ── */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

              {/* Right panel header */}
              <div style={{ padding: "16px 16px 12px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>Membros</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: "#535862",
                    background: "#F2F4F7", borderRadius: 20,
                    padding: "1px 8px", lineHeight: "20px",
                  }}>
                    {addedList.length}
                  </span>
                </div>
              </div>

              {/* Search in right panel */}
              <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  border: "1px solid #D5D7DA", borderRadius: 8, padding: "7px 12px",
                }}>
                  <Search size={14} color="#A4A7AE" />
                  <input
                    value={rightSearch}
                    onChange={(e) => setRightSearch(e.target.value)}
                    placeholder="Buscar membros..."
                    style={{
                      flex: 1, border: "none", outline: "none",
                      fontSize: 13, color: "#344054", fontFamily: "inherit",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>

              {/* Select all */}
              <div style={{
                padding: "8px 16px 8px",
                borderBottom: "1px solid #E9EAEB", flexShrink: 0,
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <Checkbox
                    checked={selectAllRight}
                    onChange={(e) => setSelectAllRight(e.target.checked)}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#344054" }}>
                    Selecionar todos
                  </span>
                </label>
              </div>

              {/* Member list */}
              <ScrollArea style={{ flex: "1 1 0%", minHeight: 0, overflow: "auto" }}>
                {filteredRight.map((u, i) => (
                  <div key={u.id}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 16px",
                    }}>
                      <Checkbox />
                      <Avatar src={u.avatar} size={32} style={{ flexShrink: 0, border: "1px solid #EAECF0" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#101828", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {u.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#667085", margin: 0 }}>
                          {roles[u.id] ?? "Membro"}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleOne(u.id)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "#A4A7AE", flexShrink: 0,
                          display: "flex", alignItems: "center", padding: 2,
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#F04438"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#A4A7AE"; }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {i < filteredRight.length - 1 && (
                      <div style={{ height: 1, background: "#F2F4F7", margin: "0 16px" }} />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: 12,
        padding: "16px 24px", borderTop: "1px solid #E9EAEB", flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            height: 40, padding: "0 20px", background: "#fff", color: "#344054",
            border: "1px solid #D0D5DD", borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onCreate}
          disabled={selectedIds.length === 0}
          style={{
            height: 40, padding: "0 20px",
            background: selectedIds.length > 0 ? "#1570EF" : "#F2F4F7",
            color: selectedIds.length > 0 ? "#fff" : "#A4A7AE",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: selectedIds.length > 0 ? "pointer" : "default",
            fontFamily: "inherit", transition: "background 0.2s",
          }}
        >
          {selectedIds.length > 0 ? `Adicionar (${selectedIds.length})` : "Adicionar"}
        </button>
      </div>
    </div>
  );
}

/* ── Helpers ── */
const ArrowDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2.5v7M2.5 6l3.5 3.5L9.5 6" stroke="#A4A7AE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const paginatorBtnStyle = (disabled: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 13, fontWeight: 500,
  color: disabled ? "#D0D5DD" : "#344054",
  background: "none", border: "none",
  cursor: disabled ? "default" : "pointer",
  fontFamily: "inherit",
});
