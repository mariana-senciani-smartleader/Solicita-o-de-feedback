import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar, Flex, Typography } from "antd";
import {
  X, Undo2, Redo2, Bold, AlignLeft, List, ChevronDown, ChevronLeft, ChevronRight,
  Image as LucideImage, Sparkles, Headphones, Play, File, FileText, FileSpreadsheet,
  Plus, Paperclip, Save, Pencil, Clock, Calendar,
} from "lucide-react";
import type { MediaItem, ScheduledPost } from "./CreatePostModal";

/* ══════════════════════════════════════════════════════════════════
   Helpers / sub-components (duplicated from CreatePostModal since
   they are not exported from that file)
══════════════════════════════════════════════════════════════════ */

const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS_PT   = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const _today    = new Date();

function formatDateDisplay(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const dpNavBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  padding: 6, borderRadius: 8,
  display: "flex", alignItems: "center", justifyContent: "center",
};

/* ── DatePicker ── */
const DatePickerDropdown = ({ value, onChange }: { value: Date; onChange: (d: Date) => void }) => {
  const [viewYear,  setViewYear]  = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [pending,   setPending]   = useState(value);

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; month: "prev" | "cur" | "next" }[] = [];
  for (let i = 0; i < startOffset; i++)
    cells.push({ day: daysInPrev - startOffset + 1 + i, month: "prev" });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, month: "cur" });
  const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= rem; i++) cells.push({ day: i, month: "next" });

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const isSelected = (d: number) => pending.getFullYear() === viewYear && pending.getMonth() === viewMonth && pending.getDate() === d;
  const isToday    = (d: number) => _today.getFullYear() === viewYear && _today.getMonth() === viewMonth && _today.getDate() === d;
  const goToday    = () => { setViewYear(_today.getFullYear()); setViewMonth(_today.getMonth()); setPending(new Date(_today.getFullYear(), _today.getMonth(), _today.getDate())); };

  return (
    <div style={{ width: 280, background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.10)", padding: "16px 16px 14px", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={dpNavBtn}><ChevronLeft size={15} color="#667085" /></button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#101828" }}>{MONTHS_PT[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={dpNavBtn}><ChevronRight size={15} color="#667085" /></button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, border: "1px solid #D5D7DA", borderRadius: 8, padding: "6px 10px", fontSize: 13, color: "#101828", background: "#fff" }}>{formatDateDisplay(pending)}</div>
        <button onClick={goToday} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, color: "#344054", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Today</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 2 }}>
        {DAYS_PT.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#667085", padding: "3px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px 0" }}>
        {cells.map((cell, i) => {
          const isCur = cell.month === "cur";
          const sel   = isCur && isSelected(cell.day);
          const tod   = isCur && isToday(cell.day);
          return (
            <button key={i} onClick={() => isCur && setPending(new Date(viewYear, viewMonth, cell.day))} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: sel ? "#1570EF" : "transparent", color: sel ? "#fff" : isCur ? "#101828" : "#D0D5DD", fontSize: 13, fontWeight: sel ? 600 : 400, cursor: isCur ? "pointer" : "default", fontFamily: "inherit", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", position: "relative" }}>
              {cell.day}
              {tod && !sel && <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: "#1570EF" }} />}
            </button>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid #E9EAEB", margin: "14px 0 12px" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onChange(value)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, fontWeight: 600, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onChange(pending)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
      </div>
    </div>
  );
};

/* ── TimePicker ── */
const TimePickerDropdown = ({ value, onChange }: { value: string; onChange: (t: string) => void }) => {
  const [h, m]      = value.split(":").map(Number);
  const [pendingH, setPendingH] = useState(isNaN(h) ? 12 : h);
  const [pendingM, setPendingM] = useState(isNaN(m) ? 0  : m);
  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const hRef = useRef<HTMLDivElement>(null);
  const mRef = useRef<HTMLDivElement>(null);
  const pad  = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    hRef.current?.children[pendingH]?.scrollIntoView({ block: "center" });
    mRef.current?.children[pendingM]?.scrollIntoView({ block: "center" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: 220, background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.10)", padding: "16px 16px 14px", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#667085", marginBottom: 10, textAlign: "center" }}>{pad(pendingH)}:{pad(pendingM)}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div ref={hRef} style={{ flex: 1, height: 160, overflowY: "auto", borderRadius: 8, border: "1px solid #E9EAEB", scrollbarWidth: "none" }}>
          {hours.map(hv => <button key={hv} onClick={() => setPendingH(hv)} style={{ width: "100%", padding: "6px 0", border: "none", textAlign: "center", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: pendingH === hv ? "#1570EF" : "transparent", color: pendingH === hv ? "#fff" : "#344054", fontWeight: pendingH === hv ? 600 : 400, borderRadius: 6 }}>{pad(hv)}</button>)}
        </div>
        <div ref={mRef} style={{ flex: 1, height: 160, overflowY: "auto", borderRadius: 8, border: "1px solid #E9EAEB", scrollbarWidth: "none" }}>
          {minutes.map(mv => <button key={mv} onClick={() => setPendingM(mv)} style={{ width: "100%", padding: "6px 0", border: "none", textAlign: "center", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: pendingM === mv ? "#1570EF" : "transparent", color: pendingM === mv ? "#fff" : "#344054", fontWeight: pendingM === mv ? 600 : 400, borderRadius: 6 }}>{pad(mv)}</button>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onChange(value)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, fontWeight: 600, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onChange(`${pad(pendingH)}:${pad(pendingM)}`)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
      </div>
    </div>
  );
};

/* ── Doc type metadata (same as CreatePostModal) ── */
const getDocInfo = (fileName?: string, mimeType?: string) => {
  const ext  = (fileName?.split(".").pop() ?? "").toLowerCase();
  const mime = (mimeType ?? "").toLowerCase();
  if (ext === "pdf" || mime.includes("pdf")) return { label: "PDF", color: "#E02D3C", bg: "#FFF1F2", Icon: FileText };
  if (["xls","xlsx"].includes(ext) || mime.includes("sheet") || mime.includes("excel")) return { label: "XLS", color: "#16A34A", bg: "#F0FDF4", Icon: FileSpreadsheet };
  if (ext === "csv"  || mime.includes("csv"))  return { label: "CSV", color: "#0891B2", bg: "#ECFEFF", Icon: FileSpreadsheet };
  if (["doc","docx"].includes(ext) || mime.includes("word")) return { label: "DOC", color: "#1D4ED8", bg: "#EFF6FF", Icon: FileText };
  if (["ppt","pptx"].includes(ext) || mime.includes("presentation")) return { label: "PPT", color: "#EA580C", bg: "#FFF7ED", Icon: File };
  return { label: ext.toUpperCase() || "FILE", color: "#64748B", bg: "#F8FAFC", Icon: FileText };
};

let _uid = 1000;
const uid = () => `e${_uid++}`;

/* ── Toolbar helpers ── */
const ToolBtn = ({ children }: { children: React.ReactNode }) => (
  <button style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: "#344054", display: "flex", alignItems: "center" }}
    onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
    onMouseLeave={e => (e.currentTarget.style.background = "none")}
  >{children}</button>
);
const ToolBtnLabel = ({ children }: { children: React.ReactNode }) => (
  <button style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: "#344054", display: "flex", alignItems: "center", gap: 4 }}
    onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
    onMouseLeave={e => (e.currentTarget.style.background = "none")}
  >{children}</button>
);
const TDivider = () => <div style={{ width: 1, height: 18, background: "#D0D5DD", margin: "0 4px", flexShrink: 0 }} />;

/* ── MediaThumb ── */
const MediaThumb = ({ item }: { item: MediaItem }) => {
  if (item.type === "image") return <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  if (item.type === "video") return (
    <>
      <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, display: "block" }} muted />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Play size={16} color="#101828" fill="#101828" style={{ marginLeft: 2 }} />
        </div>
      </div>
    </>
  );
  if (item.type === "audio") return (
    <div style={{ width: "100%", height: "100%", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 }}>
      <Headphones size={24} color="#fff" strokeWidth={1.5} />
      <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
        {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: 3, borderRadius: 2, background: "#3b82f6", height: `${4 + Math.abs(Math.sin(i * 0.9)) * 10}px` }} />)}
      </div>
      <Typography.Text style={{ color: "#94a3b8", fontSize: 10, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.fileName ?? "Áudio"}</Typography.Text>
    </div>
  );
  const { label, color, bg, Icon: DocIcon } = getDocInfo(item.fileName, item.mimeType);
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 }}>
      <DocIcon size={28} color={color} strokeWidth={1.5} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: color, borderRadius: 4, padding: "1px 6px", letterSpacing: "0.5px" }}>{label}</span>
      <Typography.Text style={{ fontSize: 10, color: "#64748b", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>{item.fileName ?? "arquivo"}</Typography.Text>
    </div>
  );
};

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: ScheduledPost["status"] }) => {
  const map = {
    agendado: { label: "Agendado", color: "#175CD3", bg: "#EFF8FF", dot: "#2E90FA", border: "#B2DDFF" },
    postado:  { label: "Postado",  color: "#067647", bg: "#ECFDF3", dot: "#17B26A", border: "#ABEFC6" },
    falhou:   { label: "Falhou",   color: "#B42318", bg: "#FEF3F2", dot: "#F04438", border: "#FECDCA" },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: s.color, background: s.bg, borderRadius: 99, padding: "2px 10px 2px 8px", whiteSpace: "nowrap", border: `1px solid ${s.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════════
   EditPostModal
══════════════════════════════════════════════════════════════════ */
interface Props {
  post: ScheduledPost | null;
  onClose: () => void;
  onSave: (updated: ScheduledPost) => void;
}

const EditPostModal = ({ post, onClose, onSave }: Props) => {
  const [text,          setText]          = useState("");
  const [media,         setMedia]         = useState<MediaItem[]>([]);
  const [scheduleDate,  setScheduleDate]  = useState<Date>(new Date());
  const [scheduleTime,  setScheduleTime]  = useState("12:00");
  const [datePickerOpen,setDatePickerOpen]= useState(false);
  const [timePickerOpen,setTimePickerOpen]= useState(false);
  const [datePickerPos, setDatePickerPos] = useState({ bottom: 0, left: 0 });
  const [timePickerPos, setTimePickerPos] = useState({ bottom: 0, left: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef  = useRef<HTMLInputElement>(null);
  const dateBtnRef   = useRef<HTMLButtonElement>(null);
  const timeBtnRef   = useRef<HTMLButtonElement>(null);

  /* Populate state when post changes */
  useEffect(() => {
    if (post) {
      setText(post.content);
      setMedia(post.media ? [...post.media] : []);
      setScheduleDate(new Date(post.scheduledAt));
      const h = post.scheduledAt.getHours();
      const m = post.scheduledAt.getMinutes();
      setScheduleTime(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
      setDatePickerOpen(false);
      setTimePickerOpen(false);
    }
  }, [post]);

  if (!post) return null;

  /* ── File handling ── */
  const processFiles = (files: File[]) => {
    const items: MediaItem[] = files.map(file => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/"))  return { id: uid(), type: "image"    as const, url, fileName: file.name, mimeType: file.type };
      if (file.type.startsWith("video/"))  return { id: uid(), type: "video"    as const, url, fileName: file.name, mimeType: file.type };
      if (file.type.startsWith("audio/"))  return { id: uid(), type: "audio"    as const, url, fileName: file.name, mimeType: file.type };
      return                                      { id: uid(), type: "document" as const, url, fileName: file.name, mimeType: file.type };
    });
    setMedia(prev => [...prev, ...items]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setMedia(prev => {
      const item = prev.find(m => m.id === id);
      if (item?.url?.startsWith("blob:")) URL.revokeObjectURL(item.url);
      return prev.filter(m => m.id !== id);
    });
  };

  /* ── Save ── */
  const handleSave = () => {
    const [hours, minutes] = scheduleTime.split(":").map(Number);
    const scheduledAt = new Date(scheduleDate);
    scheduledAt.setHours(hours, minutes, 0, 0);
    onSave({ ...post, content: text.trim(), media, scheduledAt });
    onClose();
  };

  /* ── Open pickers ── */
  const openDatePicker = () => {
    if (dateBtnRef.current) {
      const r = dateBtnRef.current.getBoundingClientRect();
      const bottom = window.innerHeight - r.top + 8;
      const left = r.left;
      setDatePickerPos({ bottom, left: Math.max(8, Math.min(left, window.innerWidth - 288)) });
    }
    setTimePickerOpen(false);
    setDatePickerOpen(v => !v);
  };
  const openTimePicker = () => {
    if (timeBtnRef.current) {
      const r = timeBtnRef.current.getBoundingClientRect();
      const bottom = window.innerHeight - r.top + 8;
      const left = r.left;
      setTimePickerPos({ bottom, left: Math.max(8, Math.min(left, window.innerWidth - 228 - 8)) });
    }
    setDatePickerOpen(false);
    setTimePickerOpen(v => !v);
  };

  const canSave = text.trim().length > 0;

  return (
    <>
      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" style={{ display: "none" }} onChange={handleFiles} />
      <input ref={docInputRef}  type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,.ppt,.pptx" style={{ display: "none" }} onChange={handleFiles} />

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(10,13,18,0.7)" }}
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1501,
          width: "min(800px, calc(100vw - 48px))",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 24px 80px rgba(10,13,18,0.22)",
          border: "1px solid #E9EAEB",
          display: "flex", flexDirection: "column",
          maxHeight: "92vh", overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
          <Flex align="flex-start" justify="space-between">
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828", lineHeight: "24px", display: "block" }}>
                Editar Postagem
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>
                Edite o conteúdo, a data e a hora da publicação.
              </Typography.Text>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#717680", display: "flex", lineHeight: 0, flexShrink: 0, marginTop: 2 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <X size={18} />
            </button>
          </Flex>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto" }} className="thin-scrollbar">

          {/* Author row */}
          <Flex align="center" gap={10} style={{ padding: "16px 24px" }}>
            <Avatar src={post.avatar} size={36} style={{ flexShrink: 0 }} />
            <Typography.Text strong style={{ fontSize: 14, color: "#101828", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {post.author}
            </Typography.Text>
            <StatusBadge status={post.status} />
          </Flex>

          {/* ── Editor container (bordered box with toolbar + textarea) ── */}
          <div style={{ margin: "0 24px", border: "1px solid #E9EAEB", borderRadius: 10, overflow: "hidden" }}>
            {/* Toolbar inside box — fundo #F9FAFB como no SVG */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "8px 12px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB" }}>
              <ToolBtn><Undo2 size={15} color="#344054" /></ToolBtn>
              <ToolBtn><Redo2 size={15} color="#344054" /></ToolBtn>
              <TDivider />
              <ToolBtnLabel>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#344054" }}>H<sub style={{ fontSize: 9 }}>1</sub></span>
                <span style={{ fontSize: 12, color: "#667085", marginLeft: 2 }}>•</span>
                <span style={{ fontSize: 12, color: "#344054", marginLeft: 2 }}>Título 1</span>
                <ChevronDown size={12} color="#667085" />
              </ToolBtnLabel>
              <TDivider />
              <ToolBtnLabel><Bold size={14} color="#344054" /><ChevronDown size={12} color="#667085" /></ToolBtnLabel>
              <TDivider />
              <ToolBtnLabel><LucideImage size={14} color="#344054" /><ChevronDown size={12} color="#667085" /></ToolBtnLabel>
              <TDivider />
              <ToolBtnLabel><AlignLeft size={14} color="#344054" /><ChevronDown size={12} color="#667085" /></ToolBtnLabel>
              <TDivider />
              <ToolBtnLabel><List size={14} color="#344054" /><ChevronDown size={12} color="#667085" /></ToolBtnLabel>
              {/* SIA button — gradient purple→blue como no SVG */}
              <div style={{ marginLeft: "auto" }}>
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 7,
                    border: "none", background: "none",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  {/* Sparkles with gradient */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="sia-grad-icon" x1="12" y1="4" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#A12BFF" />
                        <stop offset="1" stopColor="#173FE1" />
                      </linearGradient>
                    </defs>
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="url(#sia-grad-icon)" />
                    <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" stroke="url(#sia-grad-icon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    background: "linear-gradient(160deg, #A12BFF 0%, #173FE1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    SIA
                  </span>
                </button>
              </div>
            </div>

            {/* Textarea inside box */}
            <div style={{ padding: "14px 16px 10px" }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Conteúdo da postagem..."
                rows={6}
                style={{ width: "100%", border: "none", outline: "none", resize: "none", fontFamily: "inherit", fontSize: 14, color: "#667085", lineHeight: "22px", background: "transparent", boxSizing: "border-box" }}
              />
            </div>

            {/* ── "Revisão" button inside editor box ── */}
            <div style={{ padding: "0 16px 14px" }}>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8,
                  border: "1px solid #B2DDFF", background: "#EFF8FF",
                  cursor: "pointer", fontFamily: "inherit",
                  fontSize: 13, fontWeight: 600, color: "#1570EF",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#D1E9FF")}
                onMouseLeave={e => (e.currentTarget.style.background = "#EFF8FF")}
              >
                <Pencil size={13} color="#1570EF" strokeWidth={2} />
                Revisão
              </button>
            </div>
          </div>

          {/* ── Mídia + Documentos buttons below Revisão ── */}
          <div style={{ padding: "12px 24px 0" }}>
            <Flex align="center" gap={8}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#344054", fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <LucideImage size={16} color="#667085" strokeWidth={1.67} />
                Mídia
              </button>
              <button
                onClick={() => docInputRef.current?.click()}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#344054", fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <Paperclip size={16} color="#667085" strokeWidth={1.67} />
                Documentos
              </button>
            </Flex>
          </div>

          {/* Media grid */}
          {media.length > 0 && (
            <div style={{ padding: "12px 24px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {media.map(item => (
                  <div key={item.id} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 10, overflow: "hidden" }}>
                    <MediaThumb item={item} />
                    <button
                      onClick={() => removeMedia(item.id)}
                      style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
                    >
                      <X size={10} color="#fff" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ aspectRatio: "1 / 1", borderRadius: 10, border: "1.5px dashed #D5D7DA", background: "#FAFAFA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#1570EF")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#D5D7DA")}
                >
                  <Plus size={20} color="#A4A7AE" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {/* ── Quando publicar? ── */}
          <div style={{ padding: "20px 24px 24px" }}>
            <Flex align="center" gap={8} style={{ marginBottom: 14 }}>
              <Clock size={16} color="#344054" strokeWidth={2} />
              <Typography.Text strong style={{ fontSize: 14, color: "#344054" }}>
                Quando publicar?
              </Typography.Text>
            </Flex>

            <div style={{ display: "flex", gap: 16 }}>
              {/* Date field — full-width input style */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <Typography.Text style={{ fontSize: 12, color: "#667085" }}>Data</Typography.Text>
                <button
                  ref={dateBtnRef}
                  onClick={openDatePicker}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 8, width: "100%",
                    border: datePickerOpen ? "1px solid #1570EF" : "1px solid #D5D7DA",
                    background: "#fff", cursor: "pointer",
                    fontSize: 14, color: "#667085", fontFamily: "inherit",
                    boxShadow: datePickerOpen ? "0 0 0 3px rgba(21,112,239,0.10)" : "0 1px 2px rgba(10,13,18,0.05)",
                    boxSizing: "border-box",
                  }}
                >
                  <Calendar size={16} color="#667085" strokeWidth={1.67} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: "left" }}>{formatDateDisplay(scheduleDate)}</span>
                </button>
              </div>

              {/* Time field — full-width input style */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <Typography.Text style={{ fontSize: 12, color: "#667085" }}>Hora</Typography.Text>
                <button
                  ref={timeBtnRef}
                  onClick={openTimePicker}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 8, width: "100%",
                    border: timePickerOpen ? "1px solid #1570EF" : "1px solid #D5D7DA",
                    background: "#fff", cursor: "pointer",
                    fontSize: 14, color: "#667085", fontFamily: "inherit",
                    boxShadow: timePickerOpen ? "0 0 0 3px rgba(21,112,239,0.10)" : "0 1px 2px rgba(10,13,18,0.05)",
                    boxSizing: "border-box",
                  }}
                >
                  <Clock size={16} color="#667085" strokeWidth={1.67} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: "left" }}>{scheduleTime}</span>
                </button>
              </div>
            </div>
          </div>

        </div>{/* end scrollable body */}

        {/* ── Footer — two full-width buttons ── */}
        <div style={{ borderTop: "1px solid #E9EAEB", padding: "16px 24px", flexShrink: 0, background: "#fff" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "10px 16px", borderRadius: 8,
                border: "1px solid #D5D7DA", background: "#fff",
                cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#344054", fontFamily: "inherit",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "10px 16px", borderRadius: 8,
                border: "none", background: canSave ? "#1570EF" : "#D0D5DD",
                cursor: canSave ? "pointer" : "default",
                fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (canSave) e.currentTarget.style.background = "#1462D4"; }}
              onMouseLeave={e => { if (canSave) e.currentTarget.style.background = "#1570EF"; }}
            >
              <Save size={15} color="#fff" strokeWidth={2} />
              Salvar alterações
            </button>
          </div>
        </div>

      </div>

      {/* ── Floating date picker ── */}
      {datePickerOpen && createPortal(
        <div style={{ position: "fixed", bottom: datePickerPos.bottom, left: datePickerPos.left, zIndex: 2000 }}>
          <DatePickerDropdown
            value={scheduleDate}
            onChange={d => { setScheduleDate(d); setDatePickerOpen(false); }}
          />
        </div>,
        document.body
      )}

      {/* ── Floating time picker ── */}
      {timePickerOpen && createPortal(
        <div style={{ position: "fixed", bottom: timePickerPos.bottom, left: timePickerPos.left, zIndex: 2000 }}>
          <TimePickerDropdown
            value={scheduleTime}
            onChange={t => { setScheduleTime(t); setTimePickerOpen(false); }}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default EditPostModal;
