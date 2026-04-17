import { useState } from "react";
import { X, ChevronRight, Search, RotateCcw } from "lucide-react";
import { Checkbox, Input } from "antd";

interface FilterCategory {
  id: string;
  label: string;
  options: string[];
}

const categories: FilterCategory[] = [
  { id: "regional",    label: "Regional",              options: ["Argentina", "Chile", "Brasil", "México", "Colômbia"] },
  { id: "unidades",    label: "Unidades",              options: ["Unidade SP", "Unidade RJ", "Unidade MG", "Unidade RS"] },
  { id: "diretoria",   label: "Diretoria",             options: ["Diretoria Executiva", "Diretoria Comercial", "Diretoria Financeira"] },
  { id: "area",        label: "Área",                  options: ["Recursos Humanos", "Tecnologia", "Financeiro", "Comercial", "Operações"] },
  { id: "cargo",       label: "Cargo chave",           options: ["Diretor", "Gerente", "Coordenador", "Analista", "Assistente"] },
  { id: "importancia", label: "Nível de Importância",  options: ["Alta", "Média", "Baixa"] },
  { id: "especificidade", label: "Nível de Especificidade", options: ["Específico", "Geral"] },
  { id: "impacto",     label: "Impacto da perda",      options: ["Alto", "Médio", "Baixo"] },
  { id: "sucessores",  label: "Sucessores",            options: ["Pronto agora", "Pronto em 1 ano", "Pronto em 2+ anos"] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const SmartFilterDrawer = ({ open, onClose }: Props) => {
  const [activeCategory, setActiveCategory] = useState("regional");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>({ regional: ["Brasil"] });
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  if (!open) return null;

  const cat = categories.find((c) => c.id === activeCategory)!;
  const selectedForCat = selected[activeCategory] || [];
  const totalSelected = Object.values(selected).flat().length;

  const filteredOptions = cat.options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  ).filter((o) => (showOnlySelected ? selectedForCat.includes(o) : true));

  const toggle = (option: string) => {
    setSelected((prev) => {
      const cur = prev[activeCategory] || [];
      const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
      return { ...prev, [activeCategory]: next };
    });
  };

  const toggleAll = () => {
    const cur = selected[activeCategory] || [];
    setSelected((prev) => ({
      ...prev,
      [activeCategory]: cur.length === cat.options.length ? [] : [...cat.options],
    }));
  };

  const clearAll = () => setSelected({});

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

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: 480, zIndex: 1001, background: "#fff",
        display: "flex", flexDirection: "column",
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #E9EAEB",
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#101828" }}>Smart Filter</span>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} color="#667085" /></button>
        </div>

        {/* Body: two columns */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left: categories */}
          <div style={{
            width: 180, borderRight: "1px solid #E9EAEB",
            overflowY: "auto", flexShrink: 0,
          }}>
            {categories.map((c) => {
              const count = (selected[c.id] || []).length;
              const isActive = c.id === activeCategory;
              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveCategory(c.id); setSearch(""); setShowOnlySelected(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", border: "none", cursor: "pointer", fontFamily: "inherit",
                    background: isActive ? "#EFF8FF" : "#fff",
                    borderLeft: isActive ? "2px solid #1570EF" : "2px solid transparent",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 13, color: isActive ? "#1570EF" : "#344054", fontWeight: isActive ? 500 : 400 }}>
                    {c.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {count > 0 && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#fff",
                        background: "#F04438", borderRadius: 99,
                        minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 5px",
                      }}>{count}</span>
                    )}
                    <ChevronRight size={14} color={isActive ? "#1570EF" : "#98A2B3"} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: options */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Search inside panel */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #F2F4F7" }}>
              <Input
                prefix={<Search size={14} color="#A4A7AE" />}
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </div>

            {/* Todos / Selecionados toggle */}
            <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderBottom: "1px solid #F2F4F7" }}>
              <label style={toggleLabelStyle}>
                <Checkbox
                  checked={!showOnlySelected}
                  onChange={() => setShowOnlySelected(false)}
                />
                <span style={{ fontSize: 13, color: "#344054" }}>Todos</span>
              </label>
              <label style={toggleLabelStyle}>
                <Checkbox
                  checked={showOnlySelected}
                  onChange={() => setShowOnlySelected(true)}
                />
                <span style={{ fontSize: 13, color: "#344054" }}>Selecionados</span>
              </label>
            </div>

            {/* Options list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {/* Select all row */}
              <label style={{ ...optionRowStyle, borderBottom: "1px solid #F2F4F7" }}>
                <Checkbox
                  checked={selectedForCat.length === cat.options.length}
                  indeterminate={selectedForCat.length > 0 && selectedForCat.length < cat.options.length}
                  onChange={toggleAll}
                />
                <span style={{ fontSize: 13, color: "#344054", fontWeight: 500 }}>Todos</span>
              </label>

              {filteredOptions.map((opt) => (
                <label key={opt} style={optionRowStyle}>
                  <Checkbox
                    checked={selectedForCat.includes(opt)}
                    onChange={() => toggle(opt)}
                  />
                  <span style={{ fontSize: 13, color: "#344054" }}>{opt}</span>
                </label>
              ))}

              {filteredOptions.length === 0 && (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "#A4A7AE", fontSize: 13 }}>
                  Nenhum resultado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderTop: "1px solid #E9EAEB", gap: 12,
        }}>
          <button onClick={clearAll} style={clearBtnStyle}>
            <RotateCcw size={14} />
            Limpar Filtro
          </button>
          {totalSelected > 0 && (
            <span style={{ fontSize: 13, color: "#667085" }}>
              {totalSelected} de {categories.flatMap((c) => c.options).length} selecionado
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: "#1570EF", color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </>
  );
};

const iconBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "none", border: "none", cursor: "pointer", borderRadius: 8, padding: 0 };
const toggleLabelStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" };
const optionRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer" };
const clearBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#667085", fontFamily: "inherit", padding: 0 };

export default SmartFilterDrawer;
