import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar, Flex, Switch, Typography } from "antd";
import {
  Undo2, Redo2, Bold, AlignLeft, List, ChevronDown, ChevronLeft, ChevronRight,
  Image as LucideImage, Pencil, Paperclip, X, Plus,
  Headphones, Play, File, FileText, FileSpreadsheet, Archive,
  UploadCloud, Clock, Calendar,
} from "lucide-react";

/* ── Types ── */
export interface MediaItem {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url?: string;
  fileName?: string;
  mimeType?: string;
}

export interface ScheduledPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  scheduledAt: Date;
  status: "agendado" | "postado" | "falhou";
  channelLabel: string;
  media?: MediaItem[];
}

/* ── Document type metadata ── */
const getDocInfo = (fileName?: string, mimeType?: string) => {
  const ext  = (fileName?.split(".").pop() ?? "").toLowerCase();
  const mime = (mimeType ?? "").toLowerCase();
  if (ext === "pdf" || mime.includes("pdf"))
    return { label: "PDF", color: "#E02D3C", bg: "#FFF1F2", Icon: FileText };
  if (["xls", "xlsx"].includes(ext) || mime.includes("sheet") || mime.includes("excel"))
    return { label: "XLS", color: "#16A34A", bg: "#F0FDF4", Icon: FileSpreadsheet };
  if (ext === "csv" || mime.includes("csv"))
    return { label: "CSV", color: "#0891B2", bg: "#ECFEFF", Icon: FileSpreadsheet };
  if (["doc", "docx"].includes(ext) || mime.includes("word"))
    return { label: "DOC", color: "#1D4ED8", bg: "#EFF6FF", Icon: FileText };
  if (["ppt", "pptx"].includes(ext) || mime.includes("presentation"))
    return { label: "PPT", color: "#EA580C", bg: "#FFF7ED", Icon: File };
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return { label: "ZIP", color: "#7C3AED", bg: "#F5F3FF", Icon: Archive };
  if (ext === "txt" || mime.includes("plain"))
    return { label: "TXT", color: "#64748B", bg: "#F8FAFC", Icon: FileText };
  return { label: ext.toUpperCase() || "FILE", color: "#64748B", bg: "#F8FAFC", Icon: File };
};

/* ── Props ── */
interface Props {
  open: boolean;
  onClose: () => void;
  onPublish: (post: { content: string; media: MediaItem[] }) => void;
  onSchedulePost?: (post: ScheduledPost) => void;
  avatar: string;
  initialContent?: string;
  channelLabel?: string;
}

let _id = 1;
const uid = () => `m${_id++}`;

/* ── Picker anchor helper (measures button position for fixed dropdowns) ── */
function usePickerAnchor() {
  const ref = useRef<HTMLButtonElement>(null);
  const getRect = () => ref.current?.getBoundingClientRect();
  return { ref, getRect };
}

/* ── DatePicker ─────────────────────────────────────────── */
const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS_PT   = ["Mo","Tu","We","Th","Fr","Sa","Su"];

const today = new Date();

function formatDateDisplay(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface DatePickerProps { value: Date; onChange: (d: Date) => void; }

const DatePickerDropdown = ({ value, onChange }: DatePickerProps) => {
  const [viewYear,  setViewYear]  = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [pending,   setPending]   = useState(value);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  // convert to Mon-based: Mon=0 ... Sun=6
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; month: "prev" | "cur" | "next" }[] = [];
  for (let i = 0; i < startOffset; i++)
    cells.push({ day: daysInPrev - startOffset + 1 + i, month: "prev" });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, month: "cur" });
  const remainder = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= remainder; i++)
    cells.push({ day: i, month: "next" });

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const isSelected = (day: number) =>
    pending.getFullYear() === viewYear && pending.getMonth() === viewMonth && pending.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const selectDay = (day: number) => setPending(new Date(viewYear, viewMonth, day));

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setPending(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  return (
    <div style={{ width: 280, background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.10)", padding: "16px 16px 14px", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
      {/* Nav — topo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={dpNavBtn}><ChevronLeft size={15} color="#667085" /></button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#101828" }}>{MONTHS_PT[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={dpNavBtn}><ChevronRight size={15} color="#667085" /></button>
      </div>

      {/* Input + Today */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, border: "1px solid #D5D7DA", borderRadius: 8, padding: "6px 10px", fontSize: 13, color: "#101828", background: "#fff" }}>
          {formatDateDisplay(pending)}
        </div>
        <button onClick={goToday} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, color: "#344054", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Today</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 2 }}>
        {DAYS_PT.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#667085", padding: "3px 0" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px 0" }}>
        {cells.map((cell, i) => {
          const isCur = cell.month === "cur";
          const sel   = isCur && isSelected(cell.day);
          const tod   = isCur && isToday(cell.day);
          return (
            <button
              key={i}
              onClick={() => isCur && selectDay(cell.day)}
              style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: sel ? "#1570EF" : "transparent",
                color: sel ? "#fff" : isCur ? "#101828" : "#D0D5DD",
                fontSize: 13, fontWeight: sel ? 600 : 400,
                cursor: isCur ? "pointer" : "default",
                fontFamily: "inherit", margin: "0 auto", display: "flex",
                alignItems: "center", justifyContent: "center", flexDirection: "column",
                position: "relative",
              }}
            >
              {cell.day}
              {tod && !sel && (
                <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: "#1570EF" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div style={{ borderTop: "1px solid #E9EAEB", margin: "14px 0 12px" }} />

      {/* Footer */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onChange(value)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, fontWeight: 600, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onChange(pending)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
      </div>
    </div>
  );
};

/* ── TimePicker ─────────────────────────────────────────── */
interface TimePickerProps { value: string; onChange: (t: string) => void; }

const TimePickerDropdown = ({ value, onChange }: TimePickerProps) => {
  const [h, m] = value.split(":").map(Number);
  const [pendingH, setPendingH] = useState(isNaN(h) ? 12 : h);
  const [pendingM, setPendingM] = useState(isNaN(m) ? 0 : m);
  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const hRef = useRef<HTMLDivElement>(null);
  const mRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hRef.current?.children[pendingH]?.scrollIntoView({ block: "center" });
    mRef.current?.children[pendingM]?.scrollIntoView({ block: "center" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ width: 220, background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", boxShadow: "0 8px 24px rgba(10,13,18,0.10)", padding: "16px 16px 14px", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#667085", marginBottom: 10, textAlign: "center" }}>
        {pad(pendingH)}:{pad(pendingM)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {/* Hours */}
        <div ref={hRef} style={{ flex: 1, height: 160, overflowY: "auto", borderRadius: 8, border: "1px solid #E9EAEB", scrollbarWidth: "none" }}>
          {hours.map(hv => (
            <button
              key={hv}
              onClick={() => setPendingH(hv)}
              style={{
                width: "100%", padding: "6px 0", border: "none", textAlign: "center",
                fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                background: pendingH === hv ? "#1570EF" : "transparent",
                color: pendingH === hv ? "#fff" : "#344054",
                fontWeight: pendingH === hv ? 600 : 400,
                borderRadius: 6,
              }}
            >
              {pad(hv)}
            </button>
          ))}
        </div>
        {/* Minutes */}
        <div ref={mRef} style={{ flex: 1, height: 160, overflowY: "auto", borderRadius: 8, border: "1px solid #E9EAEB", scrollbarWidth: "none" }}>
          {minutes.map(mv => (
            <button
              key={mv}
              onClick={() => setPendingM(mv)}
              style={{
                width: "100%", padding: "6px 0", border: "none", textAlign: "center",
                fontSize: 13, fontFamily: "inherit", cursor: "pointer",
                background: pendingM === mv ? "#1570EF" : "transparent",
                color: pendingM === mv ? "#fff" : "#344054",
                fontWeight: pendingM === mv ? 600 : 400,
                borderRadius: 6,
              }}
            >
              {pad(mv)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onChange(value)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 13, fontWeight: 600, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button onClick={() => onChange(`${pad(pendingH)}:${pad(pendingM)}`)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
      </div>
    </div>
  );
};

const dpNavBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" };

/* ══════════════════════════════════════════════════════ */
const CreatePostModal = ({ open, onClose, onPublish, onSchedulePost, avatar, initialContent, channelLabel }: Props) => {
  const [text,          setText]          = useState("");
  const [media,         setMedia]         = useState<MediaItem[]>([]);
  const [sharing,       setSharingOpen]   = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowReactions,setAllowReactions]= useState(true);
  const [isDragging,    setIsDragging]    = useState(false);
  const [scheduleMode,    setScheduleMode]    = useState<"now" | "schedule">("now");
  const [scheduleDate,    setScheduleDate]    = useState<Date>(today);
  const [scheduleTime,    setScheduleTime]    = useState(`${String(today.getHours()).padStart(2,"0")}:${String(today.getMinutes()).padStart(2,"0")}`);
  const [datePickerOpen,  setDatePickerOpen]  = useState(false);
  const [timePickerOpen,  setTimePickerOpen]  = useState(false);
  const [datePickerPos,   setDatePickerPos]   = useState({ bottom: 0, left: 0 });
  const [timePickerPos,   setTimePickerPos]   = useState({ bottom: 0, left: 0 });

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const docInputRef   = useRef<HTMLInputElement>(null);
  const dragCounter   = useRef(0);
  const dateBtnRef    = useRef<HTMLButtonElement>(null);
  const timeBtnRef    = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setText(initialContent ?? "");
    } else {
      setText("");
      setMedia([]);
      setSharingOpen(false);
      setIsDragging(false);
      dragCounter.current = 0;
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      media.forEach(m => { if (m.url?.startsWith("blob:")) URL.revokeObjectURL(m.url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const canPublish = text.trim().length > 0;


  /* ── File processing ── */
  const openFilePicker = () => fileInputRef.current?.click();
  const openDocPicker  = () => docInputRef.current?.click();

  const processFiles = (files: File[]) => {
    if (!files.length) return;
    const items: MediaItem[] = files.map(file => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/"))  return { id: uid(), type: "image",    url, fileName: file.name, mimeType: file.type };
      if (file.type.startsWith("video/"))  return { id: uid(), type: "video",    url, fileName: file.name, mimeType: file.type };
      if (file.type.startsWith("audio/"))  return { id: uid(), type: "audio",    url, fileName: file.name, mimeType: file.type };
      return                                      { id: uid(), type: "document",  url, fileName: file.name, mimeType: file.type };
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

  /* ── Drag and drop ── */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handlePublish = () => {
    onPublish({ content: text.trim(), media });
    setText("");
    setMedia([]);
    setSharingOpen(false);
  };

  const handleSchedule = () => {
    if (!canPublish) return;
    const [hours, minutes] = scheduleTime.split(":").map(Number);
    const scheduledAt = new Date(scheduleDate);
    scheduledAt.setHours(hours, minutes, 0, 0);
    const post: ScheduledPost = {
      id: String(Date.now()),
      author: "Bruno Delorence",
      avatar,
      content: text.trim(),
      scheduledAt,
      status: "agendado",
      channelLabel: channelLabel ?? "Geral",
      media,
    };
    onSchedulePost?.(post);
    setText("");
    setMedia([]);
    setSharingOpen(false);
    setScheduleMode("now");
    onClose();
  };

  /* ── Shared: media grid ── */
  const MediaGrid = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {media.map(item => (
        <div key={item.id} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 10, overflow: "hidden" }}>
          <MediaThumb item={item} />
          <button
            onClick={() => removeMedia(item.id)}
            style={{
              position: "absolute", top: 5, right: 5,
              width: 20, height: 20, borderRadius: "50%",
              background: "rgba(0,0,0,0.55)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
            }}
          >
            <X size={10} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        onClick={openFilePicker}
        style={{
          aspectRatio: "1 / 1", borderRadius: 10,
          border: "1.5px dashed #D5D7DA", background: "#FAFAFA",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#1570EF")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#D5D7DA")}
      >
        <Plus size={20} color="#A4A7AE" strokeWidth={2} />
      </button>
    </div>
  );

  return (
    <>
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" style={{ display: "none" }} onChange={handleFiles} />
      <input ref={docInputRef}  type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,.ppt,.pptx" style={{ display: "none" }} onChange={handleFiles} />

      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(52,64,84,0.5)" }} />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1101,
          width: "min(900px, calc(100vw - 48px))",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 24px 80px rgba(10,13,18,0.22)",
          border: isDragging ? "2px solid #1570EF" : "1px solid #E9EAEB",
          display: "flex", flexDirection: "column",
          maxHeight: "92vh", overflow: "hidden",
          transition: "border-color 0.15s",
        }}
      >
        {/* ── Drag overlay ── */}
        {isDragging && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "rgba(239,248,255,0.93)", borderRadius: 16,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 12, pointerEvents: "none",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: "#EFF8FF", border: "1.5px solid #B2DDFF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UploadCloud size={32} color="#1570EF" strokeWidth={1.5} />
            </div>
            <Typography.Text strong style={{ fontSize: 16, color: "#101828" }}>
              Solte os arquivos aqui
            </Typography.Text>
            <Typography.Text style={{ fontSize: 13, color: "#667085" }}>
              Imagens, vídeos, áudios e documentos
            </Typography.Text>
          </div>
        )}

        {/* ── Author ── */}
        <Flex align="center" gap={10} style={{ padding: "16px 20px", borderBottom: "1px solid #F2F4F7" }}>
          <Avatar src={avatar} size={36} style={{ flexShrink: 0 }} />
          <Typography.Text strong style={{ fontSize: 14, color: "#101828" }}>Bruno Delorence</Typography.Text>
        </Flex>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* ── Editor container (bordered box with toolbar + textarea) ── */}
          <div style={{ margin: "16px 20px 0", border: "1px solid #E9EAEB", borderRadius: 10, overflow: "hidden" }}>
            {/* Toolbar inside box */}
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
              {/* SIA button — gradient purple→blue */}
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
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="sia-grad-create" x1="12" y1="4" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#A12BFF" />
                        <stop offset="1" stopColor="#173FE1" />
                      </linearGradient>
                    </defs>
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="url(#sia-grad-create)" />
                    <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" stroke="url(#sia-grad-create)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                placeholder="Criar publicação..."
                rows={4}
                style={{
                  width: "100%", border: "none", outline: "none", resize: "none",
                  fontFamily: "inherit", fontSize: 14, color: "#667085",
                  lineHeight: "22px", background: "transparent", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Revisão button inside editor box */}
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

          {/* Media grid */}
          {media.length > 0 && (
            <div style={{ padding: "0 20px 16px" }}>
              <MediaGrid />
            </div>
          )}

          {/* ── Sharing options (both modes) ── */}
          <div style={{ padding: "0 20px 16px" }}>
            <button
              onClick={() => setSharingOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: "#344054",
                marginBottom: sharing ? 12 : 0, padding: 0,
              }}
            >
              Opções de compartilhamento
              <ChevronDown size={16} color="#667085" style={{ transform: sharing ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {sharing && (
              <Flex vertical gap={10}>
                <Flex align="center" gap={10}>
                  <Switch checked={allowComments} onChange={setAllowComments} size="small" />
                  <Typography.Text style={{ fontSize: 14, color: "#344054" }}>Permitir comentários</Typography.Text>
                </Flex>
                <Flex align="center" gap={10}>
                  <Switch checked={allowReactions} onChange={setAllowReactions} size="small" />
                  <Typography.Text style={{ fontSize: 14, color: "#344054" }}>Permitir reações</Typography.Text>
                </Flex>
              </Flex>
            )}
          </div>

          {/* ── Quando publicar ── */}
          <div style={{ padding: "0 20px 20px" }}>
            <Flex align="center" gap={6} style={{ marginBottom: 12 }}>
              <Clock size={15} color="#667085" />
              <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#344054" }}>
                Quando publicar?
              </Typography.Text>
            </Flex>

            {/* Radio options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {([
                { value: "now",      label: "Publicar agora",  sub: "A publicação será enviada imediatamente" },
                { value: "schedule", label: "Agendar",         sub: "Defina data e hora para publicar" },
              ] as const).map(opt => {
                const active = scheduleMode === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setScheduleMode(opt.value)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "12px 14px", borderRadius: 10, textAlign: "left",
                      border: active ? "2px solid #1570EF" : "1px solid #E9EAEB",
                      background: "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {/* radio dot */}
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                      border: active ? "5px solid #1570EF" : "1.5px solid #D5D7DA",
                      background: "#fff", boxSizing: "border-box",
                    }} />
                    <div>
                      <Typography.Text strong style={{ fontSize: 13, color: "#101828", display: "block", lineHeight: "20px" }}>
                        {opt.label}
                      </Typography.Text>
                      <Typography.Text style={{ fontSize: 12, color: "#667085", lineHeight: "18px" }}>
                        {opt.sub}
                      </Typography.Text>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Date/time fields */}
            {scheduleMode === "schedule" && (
              <div style={{ background: "#F9FAFB", border: "1px solid #E9EAEB", borderRadius: 10, padding: "14px 16px" }}>
                <Typography.Text style={{ fontSize: 12, color: "#667085", display: "block", marginBottom: 12 }}>
                  Preencha a data e horário para agendar a publicação.
                </Typography.Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Data */}
                  <div>
                    <Typography.Text style={{ fontSize: 12, fontWeight: 500, color: "#344054", display: "block", marginBottom: 6 }}>Data</Typography.Text>
                    <button
                      ref={dateBtnRef}
                      onClick={() => {
                        const r = dateBtnRef.current?.getBoundingClientRect();
                        if (r) {
                          const pickerW = 280;
                          // bottom of calendar aligns with bottom of input
                          const bottom = window.innerHeight - r.bottom;
                          const left = r.left - pickerW;
                          setDatePickerPos({ bottom, left: Math.max(0, left) });
                        }
                        setDatePickerOpen(v => !v);
                        setTimePickerOpen(false);
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        border: datePickerOpen ? "1.5px solid #1570EF" : "1px solid #D5D7DA",
                        borderRadius: 8, padding: "8px 12px", background: "#fff",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#717680",
                        boxShadow: datePickerOpen ? "0 0 0 3px #D1E9FF" : "none",
                      }}
                    >
                      <Calendar size={15} color="#667085" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      {formatDateDisplay(scheduleDate)}
                    </button>
                    {datePickerOpen && createPortal(
                      <>
                        <div onClick={() => setDatePickerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1200 }} />
                        <div style={{ position: "fixed", bottom: datePickerPos.bottom, left: datePickerPos.left, zIndex: 1201 }}>
                          <DatePickerDropdown value={scheduleDate} onChange={d => { setScheduleDate(d); setDatePickerOpen(false); }} />
                        </div>
                      </>,
                      document.body
                    )}
                  </div>
                  {/* Hora */}
                  <div>
                    <Typography.Text style={{ fontSize: 12, fontWeight: 500, color: "#344054", display: "block", marginBottom: 6 }}>Hora</Typography.Text>
                    <button
                      ref={timeBtnRef}
                      onClick={() => {
                        const r = timeBtnRef.current?.getBoundingClientRect();
                        if (r) {
                          // bottom of picker aligns with bottom of input
                          const bottom = window.innerHeight - r.bottom;
                          const left = r.right + 4;
                          setTimePickerPos({ bottom, left: Math.min(left, window.innerWidth - 228 - 8) });
                        }
                        setTimePickerOpen(v => !v);
                        setDatePickerOpen(false);
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        border: timePickerOpen ? "1.5px solid #1570EF" : "1px solid #D5D7DA",
                        borderRadius: 8, padding: "8px 12px", background: "#fff",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#717680",
                        boxShadow: timePickerOpen ? "0 0 0 3px #D1E9FF" : "none",
                      }}
                    >
                      <Clock size={15} color="#667085" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      {scheduleTime}
                    </button>
                    {timePickerOpen && createPortal(
                      <>
                        <div onClick={() => setTimePickerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1200 }} />
                        <div style={{ position: "fixed", bottom: timePickerPos.bottom, left: timePickerPos.left, zIndex: 1201 }}>
                          <TimePickerDropdown value={scheduleTime} onChange={t => { setScheduleTime(t); setTimePickerOpen(false); }} />
                        </div>
                      </>,
                      document.body
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid #E9EAEB", padding: "14px 20px" }}>
          <Flex align="center" justify="space-between">
            <Flex gap={8}>
              <button onClick={openFilePicker} style={footerBtnStyle}>
                <LucideImage size={16} color="#344054" />Mídia
              </button>
              <button onClick={openDocPicker} style={footerBtnStyle}>
                <Paperclip size={16} color="#344054" />Documentos
              </button>
            </Flex>
            <Flex gap={10}>
              <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#344054", fontFamily: "inherit" }}>
                Voltar
              </button>
              <button
                onClick={canPublish ? (scheduleMode === "schedule" ? handleSchedule : handlePublish) : undefined}
                disabled={!canPublish}
                style={{
                  padding: "8px 22px", borderRadius: 8, border: "none",
                  background: canPublish ? "#1570EF" : "#F2F4F7",
                  cursor: canPublish ? "pointer" : "default",
                  fontSize: 14, fontWeight: 600,
                  color: canPublish ? "#fff" : "#A4A7AE",
                  fontFamily: "inherit", transition: "background 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {scheduleMode === "schedule" && <Clock size={14} color={canPublish ? "#fff" : "#A4A7AE"} />}
                {scheduleMode === "schedule" ? "Agendar publicação" : "Publicar"}
              </button>
            </Flex>
          </Flex>
        </div>
      </div>
    </>
  );
};

/* ── Media thumbnail renderer ── */
const MediaThumb = ({ item }: { item: MediaItem }) => {
  if (item.type === "image") {
    return <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  if (item.type === "video") {
    return (
      <>
        <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, display: "block" }} muted />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={16} color="#101828" fill="#101828" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </>
    );
  }
  if (item.type === "audio") {
    return (
      <div style={{ width: "100%", height: "100%", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 }}>
        <Headphones size={24} color="#fff" strokeWidth={1.5} />
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 16 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ width: 3, borderRadius: 2, background: "#3b82f6", height: `${4 + Math.abs(Math.sin(i * 0.9)) * 10}px` }} />
          ))}
        </div>
        <Typography.Text style={{ color: "#94a3b8", fontSize: 10, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.fileName ?? "Áudio"}
        </Typography.Text>
      </div>
    );
  }
  // document
  const { label, color, bg, Icon: DocIcon } = getDocInfo(item.fileName, item.mimeType);
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 }}>
      <DocIcon size={28} color={color} strokeWidth={1.5} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: color, borderRadius: 4, padding: "1px 6px", letterSpacing: "0.5px" }}>
        {label}
      </span>
      <Typography.Text style={{ fontSize: 10, color: "#64748b", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
        {item.fileName ?? "arquivo"}
      </Typography.Text>
    </div>
  );
};

/* ── Tiny helpers ── */
const ToolBtn = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: "#344054", display: "flex", alignItems: "center" }}
    onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
    onMouseLeave={e => (e.currentTarget.style.background = "none")}
  >
    {children}
  </button>
);
const ToolBtnLabel = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 6, color: "#344054", display: "flex", alignItems: "center", gap: 4 }}
    onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
    onMouseLeave={e => (e.currentTarget.style.background = "none")}
  >
    {children}
  </button>
);
const TDivider = () => <div style={{ width: 1, height: 18, background: "#D0D5DD", margin: "0 4px", flexShrink: 0 }} />;

const footerBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 14px", borderRadius: 8,
  border: "1px solid #D5D7DA", background: "#fff",
  cursor: "pointer", fontSize: 14, fontWeight: 500,
  color: "#344054", fontFamily: "inherit",
};

export default CreatePostModal;
