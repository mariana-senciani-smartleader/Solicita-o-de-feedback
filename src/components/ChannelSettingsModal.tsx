import { useState, useEffect, useRef } from "react";
import { Flex, Input, Switch, Typography, Avatar } from "antd";
import {
  X, Globe, Bell, BellOff,
  Search, ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevRight,
  Send, Pencil, Trash2,
  AlignLeft, Bold, Image as ImageIcon, List, Undo2, Redo2, Pen, Sparkles,
  Check, Banknote, Briefcase, Camera, Code2, Coffee, Gift, Hash,
  Headphones, Heart, Megaphone, MessageCirclePlus, Music, Rocket, Scale,
  Shield, Star, Target, BookOpen, Zap,
} from "lucide-react";
import type { ChannelInfo } from "./MainContent";
import type { ScheduledPost } from "./CreatePostModal";
import PostDetailsModal from "./PostDetailsModal";
import EditPostModal from "./EditPostModal";

/* ── Custom icons from Figma ── */
const EditIcon = ({ size = 16, color = "#A4A7AE" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.25069 11.6294C1.28132 11.3537 1.29664 11.2159 1.33834 11.0871C1.37534 10.9728 1.42762 10.864 1.49376 10.7637C1.5683 10.6507 1.66636 10.5526 1.86249 10.3565L10.6667 1.55228C11.4031 0.815905 12.597 0.815906 13.3334 1.55228C14.0697 2.28867 14.0697 3.48257 13.3333 4.21895L4.52915 13.0231C4.33303 13.2193 4.23497 13.3173 4.12192 13.3919C4.02163 13.458 3.91286 13.5103 3.79856 13.5473C3.66974 13.589 3.53191 13.6043 3.25625 13.6349L1 13.8856L1.25069 11.6294Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 16, height: 16, borderRadius: 4,
      border: checked ? "none" : "1.5px solid #D0D5DD",
      background: checked ? "#1570EF" : "#fff",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "all 0.15s",
    }}
  >
    {checked && <Check size={11} color="#fff" strokeWidth={3} />}
  </div>
);

/* ── Shared constants ── */
const COLORS = [
  "#1570EF", "#7839EE", "#6941C6", "#D92D20", "#E04F16",
  "#CA8504", "#2D9D92", "#079455", "#099250", "#0BA5EC",
  "#2E90FA", "#444CE7", "#3538CD", "#1849A9",
  "#53B1FD", "#B692F6", "#D6BBFB", "#FDA29B", "#FDB022",
  "#A6EF67", "#32D583", "#67E3F9", "#84CAFF", "#A4BCFD",
];

const ICONS: { name: string; icon: React.ElementType }[] = [
  { name: "Balança",        icon: Scale },
  { name: "Código",         icon: Code2 },
  { name: "Dinheiro",       icon: Banknote },
  { name: "Fone de ouvido", icon: Headphones },
  { name: "Hashtag",        icon: Hash },
  { name: "Megafone",       icon: Megaphone },
  { name: "Estrela",        icon: Star },
  { name: "Coração",        icon: Heart },
  { name: "Foguete",        icon: Rocket },
  { name: "Global",         icon: Globe },
  { name: "Sino",           icon: Bell },
  { name: "Raio",           icon: Zap },
  { name: "Escudo",         icon: Shield },
  { name: "Alvo",           icon: Target },
  { name: "Livro",          icon: BookOpen },
  { name: "Pasta",          icon: Briefcase },
  { name: "Câmera",         icon: Camera },
  { name: "Café",           icon: Coffee },
  { name: "Presente",       icon: Gift },
  { name: "Música",         icon: Music },
];

/* ── Icon + colour picker ── */
const IconColorPicker = ({ selectedColor, selectedIconName, onColorSelect, onIconSelect }: {
  selectedColor: string;
  selectedIconName: string;
  onColorSelect: (c: string) => void;
  onIconSelect: (n: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = ICONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ width: 260, background: "#fff", border: "1px solid #E9EAEB", borderRadius: 16, boxShadow: "0 8px 24px rgba(10,13,18,0.12)", overflow: "hidden" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #E9EAEB" }}>
        <Flex wrap="wrap" gap={6}>
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              style={{ width: 24, height: 24, borderRadius: "50%", background: color, border: selectedColor === color ? "2px solid #fff" : "none", boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {selectedColor === color && <Check size={11} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </Flex>
      </div>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #E9EAEB" }}>
        <Flex align="center" gap={8} style={{ background: "#F5F5F5", borderRadius: 8, padding: "6px 10px" }}>
          <Search size={13} color="#A4A7AE" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar ícone" style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#181D27", width: "100%", fontFamily: "inherit" }} />
        </Flex>
      </div>
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "16px 12px", textAlign: "center", color: "#A4A7AE", fontSize: 13 }}>Nenhum ícone encontrado</div>
        )}
        {filtered.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onIconSelect(name)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: selectedIconName === name ? "#F5F5F5" : "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 14, color: "#414651" }}
            onMouseEnter={e => { if (selectedIconName !== name) e.currentTarget.style.background = "#FAFAFA"; }}
            onMouseLeave={e => { if (selectedIconName !== name) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: selectedColor + "20", flexShrink: 0 }}>
              <Icon size={15} style={{ color: selectedColor }} />
            </div>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Props ── */
interface Props {
  open: boolean;
  channel: ChannelInfo;
  onClose: () => void;
  scheduledPosts: ScheduledPost[];
  onPublishScheduled: (id: string) => void;
  onDeleteScheduled: (id: string) => void;
  onUpdateScheduled?: (updated: ScheduledPost) => void;
}

const ITEMS_PER_PAGE = 10;

const ChannelSettingsModal = ({ open, channel, onClose, scheduledPosts, onPublishScheduled, onDeleteScheduled, onUpdateScheduled }: Props) => {
  const [tab, setTab] = useState<"settings" | "scheduled">("settings");

  // Settings tab state
  const [name, setName] = useState(channel.label);
  const [description, setDescription] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [moderatorsOnly, setModeratorsOnly] = useState(true);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(channel.iconBg);
  const [selectedIconName, setSelectedIconName] = useState("");

  // Scheduled tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "agendado" | "postado" | "falhou">("all");
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmPublish, setConfirmPublish] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [detailPost, setDetailPost] = useState<ScheduledPost | null>(null);
  const [editPost,   setEditPost]   = useState<ScheduledPost | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setName(channel.label);
      setSelectedColor(channel.iconBg);
      const found = ICONS.find(i => i.icon === channel.icon);
      if (found) setSelectedIconName(found.name);
      setTab("settings");
      setSearchQuery("");
      setStatusFilter("all");
      setCurrentPage(1);
      setPickerOpen(false);
      setSelectedRows(new Set());
      setSortOrder("asc");
      setDetailPost(null);
      setEditPost(null);
    }
  }, [open, channel.label, channel.iconBg, channel.icon]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!open) return null;

  const selectedIconObj = ICONS.find(i => i.name === selectedIconName);
  const SelectedIcon = selectedIconObj ? selectedIconObj.icon : (channel.icon || MessageCirclePlus);

  // Scheduled tab logic
  const channelScheduled = scheduledPosts.filter(p => p.channelLabel === channel.label);
  const pendingCount = channelScheduled.filter(p => p.status === "agendado").length;

  const filtered = channelScheduled.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.content.toLowerCase().includes(q) && !p.author.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    const diff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
    return sortOrder === "asc" ? diff : -diff;
  });

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / ITEMS_PER_PAGE));
  const pageItems = sortedFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = (items: ScheduledPost[]) => {
    const allSelected = items.length > 0 && items.every(p => selectedRows.has(p.id));
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (allSelected) items.forEach(p => next.delete(p.id));
      else items.forEach(p => next.add(p.id));
      return next;
    });
  };

  const getPaginationPages = (current: number, total: number): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  const formatDateLine1 = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
  const formatDateLine2 = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "h";

  const StatusBadge = ({ status }: { status: ScheduledPost["status"] }) => {
    const map = {
      agendado: { label: "Agendado", color: "#175CD3", bg: "#EFF8FF", dot: "#2E90FA", border: "#B2DDFF" },
      postado:  { label: "Postado",  color: "#067647", bg: "#ECFDF3", dot: "#17B26A", border: "#ABEFC6" },
      falhou:   { label: "Falhou",   color: "#B42318", bg: "#FEF3F2", dot: "#F04438", border: "#FECDCA" },
    };
    const s = map[status];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: s.color, background: s.bg, borderRadius: 99, padding: "2px 8px 2px 6px", whiteSpace: "nowrap", border: `1px solid ${s.border}` }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
        {s.label}
      </span>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(10,13,18,0.7)" }} />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1201,
          width: tab === "scheduled" ? "min(1260px, calc(100vw - 48px))" : "min(680px, calc(100vw - 48px))",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 24px 80px rgba(10,13,18,0.22)",
          border: "1px solid #E9EAEB",
          fontFamily: "Inter, sans-serif",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
        }}
      >
        {/* Header */}
        <Flex align="center" justify="space-between" style={{ padding: "24px 24px 0", flexShrink: 0 }}>
          <Flex align="center" gap={16}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: selectedColor + "20",
              transition: "background 0.25s ease",
            }}>
              <SelectedIcon size={22} style={{ color: selectedColor, transition: "color 0.25s ease" }} />
            </div>
            <div>
              <Typography.Text strong style={{ fontSize: 15, color: "#181D27", display: "block", lineHeight: "22px" }}>
                Editar canal
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#667085" }}>
                Atualize as informações do canal.
              </Typography.Text>
            </div>
          </Flex>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#717680", display: "flex", lineHeight: 0 }}>
            <X size={18} />
          </button>
        </Flex>

        {/* Tabs */}
        <Flex align="center" gap={0} style={{ padding: "0 24px", borderBottom: "1px solid #E9EAEB", flexShrink: 0, marginTop: 16 }}>
          {([
            { value: "settings" as const,  label: "Configurações do canal" },
            { value: "scheduled" as const, label: "Postagens agendadas" },
          ]).map(t => {
            const isActive = tab === t.value;
            return (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setCurrentPage(1); setPickerOpen(false); setSelectedRows(new Set()); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "14px 4px", marginRight: 24,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#1570EF" : "#717680",
                  borderBottom: isActive ? "2px solid #1570EF" : "2px solid transparent",
                  marginBottom: -1,
                  transition: "color 0.15s, border-color 0.15s",
                  flexShrink: 0,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </Flex>

        {/* ── Settings tab ── */}
        {tab === "settings" && (
          <>
            <div style={{ padding: "20px 24px 8px", overflowY: "auto", flex: 1 }} className="thin-scrollbar">
              {/* Channel name */}
              <div style={{ marginBottom: 16 }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}>
                    Nome do canal
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {name.length}/50 caracteres
                  </Typography.Text>
                </Flex>
                <Input
                  value={name}
                  onChange={e => { if (e.target.value.length <= 50) setName(e.target.value); }}
                  style={{ borderRadius: 8 }}
                />
              </div>

              {/* Rich text editor area */}
              <div style={{ border: "1px solid #E9EAEB", borderRadius: 12, overflow: "hidden", marginBottom: 16, display: "flex", flexDirection: "column" }}>
                {/* Toolbar */}
                <Flex align="center" justify="space-between" style={{ padding: "8px 12px", borderBottom: "1px solid #E9EAEB", background: "#FAFAFA", flexShrink: 0 }}>
                  <Flex align="center" gap={2}>
                    {[Undo2, Redo2].map((Icon, i) => (
                      <button key={i} style={tbStyle}><Icon size={14} /></button>
                    ))}
                    <TDiv />
                    <button style={tbStyle}>
                      <span style={{ fontWeight: 700 }}>H1</span>
                      <span style={{ margin: "0 2px", color: "#D5D7DA" }}>·</span>
                      <span style={{ fontSize: 12 }}>Título 1</span>
                      <ChevronDown size={11} />
                    </button>
                    <TDiv />
                    {[Bold, ImageIcon, AlignLeft, List].map((Icon, i) => (
                      <button key={i} style={tbStyle}><Icon size={14} /><ChevronDown size={10} /></button>
                    ))}
                  </Flex>
                  <button style={{ ...tbStyle, color: "#7A5AF8", fontWeight: 600 }}>
                    <Sparkles size={14} fill="#7A5AF8" /> SIA
                  </button>
                </Flex>

                {/* Textarea */}
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Descreva sobre o que será discutido no canal, quais termos são proibidos, regras..."
                  style={{ width: "100%", minHeight: 90, padding: "12px 16px", fontSize: 14, background: "#fff", border: "none", outline: "none", resize: "none", fontFamily: "inherit", color: "#181D27", boxSizing: "border-box", flex: 1, lineHeight: "22px" }}
                />

                {/* Revisão button */}
                <div style={{ padding: "8px 12px", background: "#fff", flexShrink: 0 }}>
                  <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6, border: "1px solid #B2DDFF", background: "#EFF8FF", color: "#1570EF", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    <Pen size={12} /> Revisão
                  </button>
                </div>
              </div>

              {/* Icon / colour picker trigger */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <Flex align="center" gap={12} style={{ padding: "4px 0" }}>
                  <button
                    ref={triggerRef}
                    onClick={() => setPickerOpen(v => !v)}
                    style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E9EAEB", cursor: "pointer", flexShrink: 0, background: selectedColor + "20", transition: "background 0.2s" }}
                  >
                    <SelectedIcon size={17} style={{ color: selectedColor }} />
                  </button>
                  <div>
                    <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#181D27", display: "block" }}>
                      Alterar ícone e cor do canal
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Defina um ícone para representar seu grupo
                    </Typography.Text>
                  </div>
                </Flex>
                {pickerOpen && (
                  <div ref={pickerRef} style={{ position: "absolute", left: 0, top: 54, zIndex: 1000 }}>
                    <IconColorPicker
                      selectedColor={selectedColor}
                      selectedIconName={selectedIconName}
                      onColorSelect={setSelectedColor}
                      onIconSelect={n => { setSelectedIconName(n); setPickerOpen(false); }}
                    />
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: "#E9EAEB", margin: "0 0 16px" }} />

              {/* Advanced options */}
              <div style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setAdvancedOpen(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#414651", padding: "4px 0", fontFamily: "inherit" }}
                >
                  Opções avançadas {advancedOpen ? <ChevronDown size={15} /> : <ChevRight size={15} />}
                </button>
                {advancedOpen && (
                  <Flex vertical gap={16} style={{ marginTop: 12 }}>
                    <ToggleOpt label="Apenas moderadores podem postar neste canal"    checked={moderatorsOnly}   onChange={setModeratorsOnly} />
                    <ToggleOpt label="Permitir anexar arquivos, vídeos, áudios e fotos" checked={allowAttachments} onChange={setAllowAttachments} />
                    <ToggleOpt label="Permitir reações nas postagens"                  checked={allowReactions}   onChange={setAllowReactions} />
                    <ToggleOpt label="Permitir comentários nas postagens"              checked={allowComments}    onChange={setAllowComments} />
                  </Flex>
                )}
              </div>
            </div>

            {/* Footer */}
            <Flex justify="flex-end" gap={12} style={{ padding: "16px 24px", borderTop: "1px solid #E9EAEB", background: "#FAFAFA", flexShrink: 0 }}>
              <button onClick={onClose} style={cancelBtnStyle}>Cancelar</button>
              <button onClick={onClose} style={saveBtnStyle}>Salvar alterações</button>
            </Flex>
          </>
        )}

        {/* ── Scheduled posts tab ── */}
        {tab === "scheduled" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Search + filter bar */}
            <div style={{ padding: "16px 24px", flexShrink: 0 }}>
              <Flex align="center" gap={12}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", width: 320 }}>
                  <Search size={16} color="#A4A7AE" style={{ position: "absolute", left: 12, pointerEvents: "none" }} />
                  <input
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Pesquisar..."
                    style={{ width: "100%", padding: "9px 14px 9px 38px", border: "1px solid #D5D7DA", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", color: "#101828", boxSizing: "border-box", lineHeight: "20px" }}
                    onFocus={e => (e.target.style.borderColor = "#1570EF")}
                    onBlur={e => (e.target.style.borderColor = "#D5D7DA")}
                  />
                </div>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => { setSortOrder(v => v === "asc" ? "desc" : "asc"); setCurrentPage(1); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", color: "#344054", fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", fontWeight: 500, lineHeight: "20px" }}
                >
                  Data
                  <ChevronDown size={16} color="#A4A7AE" style={{ transform: sortOrder === "desc" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                </button>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setStatusDropOpen(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", color: "#344054", fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", fontWeight: 500, lineHeight: "20px" }}
                  >
                    Filtrar por
                    <ChevronDown size={16} color="#A4A7AE" />
                  </button>
                  {statusDropOpen && (
                    <>
                      <div onClick={() => setStatusDropOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "#fff", borderRadius: 10, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 160, overflow: "hidden" }}>
                        {(["all", "agendado", "postado", "falhou"] as const).map(val => {
                          const labels = { all: "Todos", agendado: "Agendado", postado: "Postado", falhou: "Falhou" };
                          const dotColors = { all: "", agendado: "#2E90FA", postado: "#17B26A", falhou: "#F04438" };
                          return (
                            <button key={val} onClick={() => { setStatusFilter(val); setStatusDropOpen(false); setCurrentPage(1); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "none", background: statusFilter === val ? "#F5F8FF" : "#fff", fontSize: 13, color: statusFilter === val ? "#1570EF" : "#344054", fontWeight: statusFilter === val ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                              {val !== "all" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColors[val], flexShrink: 0 }} />}
                              {labels[val]}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </Flex>
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {pageItems.length === 0 ? (
                <div style={{ padding: "60px 24px", textAlign: "center" }}>
                  <Typography.Text style={{ fontSize: 14, color: "#717680" }}>
                    {channelScheduled.length === 0 ? "Nenhuma postagem agendada para este canal." : "Nenhum resultado encontrado."}
                  </Typography.Text>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E9EAEB", background: "#FAFAFA" }}>
                      <th style={{ padding: "12px 12px 12px 24px", width: 28 }}>
                        <CustomCheckbox
                          checked={pageItems.length > 0 && pageItems.every(p => selectedRows.has(p.id))}
                          onChange={() => toggleAll(pageItems)}
                        />
                      </th>
                      <th style={thStyle}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                          Membro <ChevronDown size={14} color="#A4A7AE" />
                        </span>
                      </th>
                      <th style={{ ...thStyle, width: 130 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                          Status <ChevronDown size={14} color="#A4A7AE" />
                        </span>
                      </th>
                      <th
                        onClick={() => { setSortOrder(v => v === "asc" ? "desc" : "asc"); setCurrentPage(1); }}
                        style={{ ...thStyle, width: 170, cursor: "pointer", userSelect: "none" }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          Data e hora <ChevronDown size={14} color="#A4A7AE" style={{ transform: sortOrder === "desc" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                        </span>
                      </th>
                      <th style={{ ...thStyle, width: 80, textAlign: "right", paddingRight: 24 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((post, i) => {
                      const isSelected = selectedRows.has(post.id);
                      return (
                        <tr
                          key={post.id}
                          onClick={() => setDetailPost(post)}
                          style={{
                            borderBottom: i < pageItems.length - 1 ? "1px solid #E9EAEB" : "none",
                            background: isSelected ? "#F5F8FF" : "transparent",
                            cursor: "pointer",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "#F9FAFB"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = isSelected ? "#F5F8FF" : "transparent"; }}
                        >
                          <td style={{ padding: "16px 12px 16px 24px" }} onClick={e => e.stopPropagation()}>
                            <CustomCheckbox
                              checked={isSelected}
                              onChange={() => toggleRow(post.id)}
                            />
                          </td>
                          <td style={{ padding: "16px 16px 16px 0" }}>
                            <Flex align="center" gap={12}>
                              <Avatar src={post.avatar} size={40} style={{ flexShrink: 0 }} />
                              <div style={{ minWidth: 0 }}>
                                <Typography.Text style={{ fontSize: 14, fontWeight: 600, color: "#101828", display: "block", lineHeight: "20px" }}>
                                  {post.author}
                                </Typography.Text>
                                <Typography.Text style={{ fontSize: 13, color: "#717680", display: "block", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 480 }}>
                                  {post.content}
                                </Typography.Text>
                              </div>
                            </Flex>
                          </td>
                          <td style={{ padding: "16px 16px" }}>
                            <StatusBadge status={post.status} />
                          </td>
                          <td style={{ padding: "16px 16px" }}>
                            <Typography.Text style={{ fontSize: 14, color: "#344054", display: "block", lineHeight: "20px" }}>
                              {formatDateLine1(post.scheduledAt)}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: 14, color: "#667085", display: "block", lineHeight: "20px" }}>
                              {formatDateLine2(post.scheduledAt)}
                            </Typography.Text>
                          </td>
                          <td style={{ padding: "16px 24px 16px 16px" }} onClick={e => e.stopPropagation()}>
                            <Flex align="center" gap={4} justify="flex-end">
                              <button onClick={() => post.status !== "postado" ? setConfirmPublish(post.id) : undefined} disabled={post.status === "postado"} title={post.status !== "postado" ? "Publicar agora" : "Já publicado"} style={iconActionStyle(post.status === "postado")}>
                                <Send size={16} color="#98A2B3" />
                              </button>
                              <button onClick={() => setEditPost(post)} title="Editar postagem" style={iconActionStyle(false)}>
                                <EditIcon size={16} color="#98A2B3" />
                              </button>
                              <button onClick={() => setConfirmDelete(post.id)} title="Excluir postagem" style={iconActionStyle(false)}>
                                <Trash2 size={16} color="#98A2B3" />
                              </button>
                            </Flex>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ borderTop: "1px solid #E9EAEB", padding: "14px 24px", flexShrink: 0 }}>
                <Flex align="center" justify="space-between">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 14, color: "#344054", fontWeight: 600, cursor: currentPage === 1 ? "default" : "pointer", fontFamily: "inherit", opacity: currentPage === 1 ? 0.4 : 1, lineHeight: "20px" }}>
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <Flex align="center" gap={0}>
                    {getPaginationPages(currentPage, totalPages).map((page, idx) =>
                      page === "..." ? (
                        <span key={`e-${idx}`} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#667085", fontSize: 14 }}>...</span>
                      ) : (
                        <button key={page} onClick={() => setCurrentPage(page as number)} style={{ width: 40, height: 40, borderRadius: 8, border: "none", background: currentPage === page ? "#F2F4F7" : "transparent", fontSize: 14, color: currentPage === page ? "#182230" : "#667085", fontWeight: currentPage === page ? 600 : 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {page}
                        </button>
                      )
                    )}
                  </Flex>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 14, color: "#344054", fontWeight: 600, cursor: currentPage === totalPages ? "default" : "pointer", fontFamily: "inherit", opacity: currentPage === totalPages ? 0.4 : 1, lineHeight: "20px" }}>
                    Próximo <ChevronRight size={16} />
                  </button>
                </Flex>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Confirm publish ── */}
      {confirmPublish && (
        <>
          <div onClick={() => setConfirmPublish(null)} style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(10,13,18,0.7)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1301, width: "min(400px, calc(100vw - 48px))", background: "#fff", borderRadius: 16, boxShadow: "0 24px 80px rgba(10,13,18,0.22)", border: "1px solid #E9EAEB", padding: "24px", fontFamily: "Inter, sans-serif" }}>
            <Flex align="flex-start" gap={14} style={{ marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Send size={20} color="#1570EF" />
              </div>
              <div>
                <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "26px" }}>Publicar agora</Typography.Text>
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>Deseja publicar esta postagem imediatamente? Ela será enviada agora.</Typography.Text>
              </div>
            </Flex>
            <div style={{ borderTop: "1px solid #E9EAEB", margin: "0 -24px 16px" }} />
            <Flex gap={10}>
              <button onClick={() => setConfirmPublish(null)} style={{ ...cancelBtnStyle, flex: 1, justifyContent: "center" }}>Cancelar</button>
              <button onClick={() => { onPublishScheduled(confirmPublish); setConfirmPublish(null); }} style={{ ...saveBtnStyle, flex: 1, justifyContent: "center" }}>Publicar agora</button>
            </Flex>
          </div>
        </>
      )}

      {/* ── Confirm delete ── */}
      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(null)} style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(10,13,18,0.7)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1301, width: "min(400px, calc(100vw - 48px))", background: "#fff", borderRadius: 16, boxShadow: "0 24px 80px rgba(10,13,18,0.22)", border: "1px solid #E9EAEB", padding: "24px", fontFamily: "Inter, sans-serif" }}>
            <Flex align="flex-start" gap={14} style={{ marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FEF3F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={20} color="#D92D20" />
              </div>
              <div>
                <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "26px" }}>Excluir postagem</Typography.Text>
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.</Typography.Text>
              </div>
            </Flex>
            <div style={{ borderTop: "1px solid #E9EAEB", margin: "0 -24px 16px" }} />
            <Flex gap={10}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...cancelBtnStyle, flex: 1, justifyContent: "center" }}>Cancelar</button>
              <button onClick={() => { onDeleteScheduled(confirmDelete); setConfirmDelete(null); }} style={{ ...saveBtnStyle, flex: 1, justifyContent: "center", background: "#D92D20" }}>Excluir</button>
            </Flex>
          </div>
        </>
      )}

      {/* ── Post details modal ── */}
      <PostDetailsModal
        post={detailPost}
        onClose={() => setDetailPost(null)}
        onDelete={(id) => {
          setDetailPost(null);
          setConfirmDelete(id);
        }}
        onPublish={(id) => {
          setDetailPost(null);
          setConfirmPublish(id);
        }}
        onRetry={(id) => {
          setDetailPost(null);
          setConfirmPublish(id);
        }}
        onEdit={(post) => {
          setDetailPost(null);
          setEditPost(post);
        }}
      />

      {/* ── Edit post modal ── */}
      <EditPostModal
        post={editPost}
        onClose={() => setEditPost(null)}
        onSave={(updated) => {
          onUpdateScheduled?.(updated);
          setEditPost(null);
        }}
      />
    </>
  );
};

/* ── Helpers ── */
const tbStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 6, color: "#535862", fontSize: 12, fontFamily: "inherit" };
const TDiv = () => <div style={{ width: 1, height: 16, background: "#E9EAEB", margin: "0 4px" }} />;
const ToggleOpt = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <Flex align="center" gap={12}>
    <Switch checked={checked} onChange={onChange} style={{ flexShrink: 0 }} />
    <Typography.Text style={{ fontSize: 14, color: "#414651" }}>{label}</Typography.Text>
  </Flex>
);
const cancelBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", padding: "8px 18px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#344054", fontFamily: "inherit" };
const saveBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", padding: "8px 22px", borderRadius: 8, border: "none", background: "#1570EF", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "inherit" };
const thStyle: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "#667085", lineHeight: "18px" };
const iconActionStyle = (disabled: boolean): React.CSSProperties => ({ width: 36, height: 36, border: "none", borderRadius: 8, background: "transparent", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.35 : 1, flexShrink: 0, padding: 0 });

export default ChannelSettingsModal;
