import { useState, useEffect } from "react";
import { Segmented, Typography } from "antd";
import {
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Check,
  X,
  FileText,
  MessageSquare,
  Sparkles,
  Trash2,
  Pencil,
  Link2Off,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const attendees = [
  { name: "Victor Stati",     email: "victor.stati@smartleader.com.br",     role: "Organizador", initials: "V", color: "#F79009" },
  { name: "Mariana Senciani", email: "mariana.senciani@smartleader.co",     role: "Convidado",   initials: "M", color: "#667085" },
  { name: "Heverton Andrade", email: "heverton.andrade@smartleader.c...",   role: "Convidado",   initials: "H", color: "#98A2B3" },
];

const pendencias = [
  { text: "Você tem pendências da", highlight: "Teste PDI no resultado - 2207 0505." },
  { text: "Você tem pendências da", highlight: "Prontidão." },
  { text: "Você tem pendências da", highlight: "AVALIAÇÃO DE COMPETÊNCIAS 2025 - Bia." },
  { text: "Você tem pendências da", highlight: "AVALIAÇÃO TESTE ABA FECHANDO." },
];

// ─── Types ───────────────────────────────────────────────────────────────────
type ModalState = null | "eventDetails" | "feedbackForm" | "success";
type FeedbackType = null | "sobreMim" | "sobreOutro" | "sobreTopico";

// ─── Calendar Card ───────────────────────────────────────────────────────────
function CalendarCard({ onEventClick }: { onEventClick: () => void }) {
  const days = [
    { short: "Dom", num: 26, isToday: false },
    { short: "Seg", num: 27, isToday: false },
    { short: "Ter", num: 28, isToday: true },
    { short: "Qua", num: 29, isToday: false },
    { short: "Qui", num: 30, isToday: false },
    { short: "Sex", num: 1,  isToday: false },
    { short: "Sáb", num: 2,  isToday: false },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={20} color="#1570EF" />
          <span style={{ fontSize: 18, fontWeight: 600, color: "#181D27" }}>Agenda</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={btnPrimaryLight}>
            <Plus size={14} />
            Novo evento
          </button>
          <button style={btnIcon}><RefreshCw size={16} color="#535862" /></button>
          <button style={{ ...btnIcon, borderColor: "#FDA29B", color: "#D92D20" }}>
            <Link2Off size={16} color="#D92D20" />
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div style={{ background: "#FAFAFA", border: "1px solid #E9EAEB", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={btnIcon}><ChevronLeft size={16} color="#535862" /></button>
            <button style={btnIcon}><ChevronRight size={16} color="#535862" /></button>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#181D27", marginLeft: 8 }}>Abr. - Mai. 2026</span>
          </div>
          <button style={btnSecondary}>
            <Calendar size={14} color="#414651" />
            Hoje
          </button>
        </div>

        {/* Days */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={btnIconSmall}><ChevronLeft size={14} color="#535862" /></button>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {days.map((d) => (
              <div key={d.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", position: "relative" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#535862", marginBottom: 6 }}>{d.short}</span>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 600,
                    background: d.isToday ? "#1570EF" : "transparent",
                    color: d.isToday ? "#fff" : "#181D27",
                  }}
                >
                  {d.num}
                </div>
                {d.isToday && (
                  <span
                    onClick={onEventClick}
                    style={{ position: "absolute", top: 38, fontSize: 9, color: "#1570EF", textAlign: "center", lineHeight: "11px", cursor: "pointer", fontWeight: 600, padding: "0 4px" }}
                  >
                    09:30 até 10:00
                    <br />
                    Clique e acesse mais informações sobre a reunião e solicite feedbacks
                  </span>
                )}
              </div>
            ))}
          </div>
          <button style={btnIconSmall}><ChevronRight size={14} color="#535862" /></button>
        </div>
      </div>

      {/* Event card */}
      <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#535862", marginTop: 12, minWidth: 40 }}>09:30</span>
        <div
          onClick={onEventClick}
          style={{
            flex: 1, background: "#EFF8FF", borderLeft: "3px solid #1570EF",
            border: "1px solid #B2DDFF", borderRadius: 10,
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <Calendar size={14} color="#1570EF" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1570EF" }}>Daily Design</span>
            </div>
            <div style={{ fontSize: 12, color: "#535862", marginBottom: 4 }}>09:30 até 10:00</div>
            <p style={{ fontSize: 11, color: "#1570EF", margin: 0, fontWeight: 500 }}>
              Clique e acesse mais informações sobre a reunião e solicite feedbacks
            </p>
          </div>
          <div style={{ display: "flex" }}>
            {attendees.map((a, i) => (
              <div
                key={a.initials}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: a.color,
                  border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  marginLeft: i === 0 ? 0 : -8,
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pendencias / Enquetes Sidebar ───────────────────────────────────────────
function PendenciasSidebar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ width: 4, height: 24, background: "#F04438", borderRadius: 2 }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: "#181D27" }}>Suas Pendências</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pendencias.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F4EBFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} color="#7F56D9" />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#535862", lineHeight: "18px", paddingTop: 4 }}>
                {p.text} <span style={{ color: "#1570EF", fontWeight: 600 }}>{p.highlight}</span>
              </p>
            </div>
          ))}
        </div>
        <button style={{ ...btnSecondary, width: "100%", marginTop: 20, justifyContent: "center", padding: "10px 16px" }}>
          Ver todas as pendências
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ width: 4, height: 24, background: "#F04438", borderRadius: 2 }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: "#181D27" }}>Enquetes</span>
        </div>

        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#181D27" }}>Brigadeiro ou beijinho?</p>
        <div style={{ fontSize: 12, color: "#A4A7AE", marginTop: 4, marginBottom: 12 }}>30/03/2026</div>
        <p style={{ margin: 0, fontSize: 13, color: "#535862", marginBottom: 16 }}>Em uma festa qual docinho você prefere?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative", height: 36, background: "#EFF8FF", borderRadius: 8, overflow: "hidden", border: "1px solid #B2DDFF" }}>
            <div style={{ position: "absolute", inset: 0, background: "#1570EF", width: "100%" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "0 12px", color: "#fff", fontSize: 13, fontWeight: 600 }}>
              <span>Brigadeiro</span>
              <span>4 Votos | 100%</span>
            </div>
          </div>
          <div style={{ height: 36, background: "#FAFAFA", borderRadius: 8, border: "1px solid #E9EAEB", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", fontSize: 13, fontWeight: 500, color: "#414651" }}>
            <span>Beijinho</span>
            <span>0 Votos | 0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Event Details Modal ─────────────────────────────────────────────────────
function EventDetailsModal({ onClose, onSolicitar }: { onClose: () => void; onSolicitar: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: 560, maxWidth: "90vw", overflow: "hidden", boxShadow: "0 20px 64px rgba(10,13,18,0.25)" }}>
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E9EAEB" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#181D27" }}>Detalhes do evento</span>
          <button onClick={onClose} style={btnIconBare}><X size={18} color="#535862" /></button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#181D27" }}>Daily Design</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={btnIcon}><Pencil size={16} color="#535862" /></button>
              <button style={{ ...btnIcon, borderColor: "#FDA29B" }}><Trash2 size={16} color="#D92D20" /></button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#414651", fontSize: 14 }}>
            <Calendar size={16} color="#535862" />
            <span>terça-feira, 28 de abril de 2026</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, color: "#414651", fontSize: 14 }}>
            <Clock size={16} color="#535862" />
            <span>09:30 até 10:00</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#414651", marginBottom: 8 }}>Link compartilhado</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, border: "1px solid #D5D7DA", borderRadius: 8, padding: "8px 12px", fontSize: 14, color: "#414651", background: "#fff" }}>
                https://meet.google.com/gch-addc-dbs
              </div>
              <button style={btnIcon}><ExternalLink size={16} color="#535862" /></button>
              <button style={btnIcon}><Copy size={16} color="#535862" /></button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #E9EAEB", paddingTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 16 }}>👥 3 Convidados</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {attendees.map((a) => (
                <div key={a.email} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {a.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#181D27", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email}</div>
                    <div style={{ fontSize: 11, color: "#717680" }}>{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #E9EAEB" }}>
          <button onClick={onSolicitar} style={btnPrimary}>
            <MessageSquare size={16} />
            Solicitar feedback
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Feedback Type Card ──────────────────────────────────────────────────────
function FeedbackTypeCard({
  icon, label, selected, onClick,
}: { icon: React.ReactNode; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        padding: "20px 12px",
        background: "#fff",
        border: selected ? "2px solid #1570EF" : "1px solid #E9EAEB",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.15s",
        minHeight: 110,
        justifyContent: "center",
      }}
    >
      <div style={{ color: selected ? "#1570EF" : "#535862" }}>{icon}</div>
      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? "#1570EF" : "#414651", textAlign: "center", lineHeight: "16px" }}>{label}</span>
    </button>
  );
}

const IconSobreMim = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="9" r="4.2" stroke="currentColor" strokeWidth="1.7" fill="none" />
    <path d="M5 24c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
  </svg>
);
const IconSobreOutro = () => (
  <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
    <circle cx="11" cy="9" r="3.8" stroke="currentColor" strokeWidth="1.7" fill="none" />
    <circle cx="21" cy="9" r="3.8" stroke="currentColor" strokeWidth="1.7" fill="none" />
    <path d="M2 24c0-4 3.5-7.5 9-7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    <path d="M30 24c0-4-3.5-7.5-9-7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    <path d="M8 24c0-3 3.5-5.5 8-5.5s8 2.5 8 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
  </svg>
);
const IconSobreTopico = () => (
  <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
    <rect x="2" y="2" width="22" height="24" rx="3" stroke="currentColor" strokeWidth="1.7" fill="none" />
    <line x1="6" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="6" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="6" y1="19" x2="15" y2="19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// ─── Feedback Request Modal ──────────────────────────────────────────────────
function FeedbackRequestModal({
  onClose, onSubmit,
}: { onClose: () => void; onSubmit: () => void }) {
  const [type, setType] = useState<FeedbackType>("sobreMim");
  const [recipient, setRecipient] = useState("");
  const [provider, setProvider] = useState("");
  const [question, setQuestion] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: 560, maxWidth: "90vw", maxHeight: "92vh", overflow: "auto", boxShadow: "0 20px 64px rgba(10,13,18,0.25)" }}>
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E9EAEB" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#181D27" }}>Solicitar feedback</span>
          <button onClick={onClose} style={btnIconBare}><X size={18} color="#535862" /></button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <FeedbackTypeCard icon={<IconSobreMim />} label="Sobre mim" selected={type === "sobreMim"} onClick={() => setType("sobreMim")} />
            <FeedbackTypeCard icon={<IconSobreOutro />} label="Sobre outro colaborador" selected={type === "sobreOutro"} onClick={() => setType("sobreOutro")} />
            <FeedbackTypeCard icon={<IconSobreTopico />} label="Sobre um tópico" selected={type === "sobreTopico"} onClick={() => setType("sobreTopico")} />
          </div>

          {type === "sobreOutro" && (
            <FormField label="Quem receberá o feedback?">
              <SelectInput value={recipient} onChange={setRecipient} placeholder="Selecione os colaboradores" options={attendees.map(a => a.name)} />
            </FormField>
          )}

          <FormField label={type === "sobreTopico" ? "Quem você quer que responda?" : "Quem você quer que ofereça o feedback?"}>
            <SelectInput value={provider} onChange={setProvider} placeholder="Selecione os colaboradores" options={attendees.map(a => a.name)} />
          </FormField>

          <FormField label="Qual é a sua pergunta?">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escreva algo..."
              rows={4}
              style={{
                width: "100%", border: "1px solid #D5D7DA", borderRadius: 10,
                padding: "10px 12px", fontSize: 14, color: "#181D27",
                fontFamily: "inherit", resize: "vertical", outline: "none",
              }}
            />
          </FormField>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#414651", marginBottom: 10 }}>Quem pode ver a solicitação?</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#414651" }}>
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
              Tornar este feedback visível para a liderança?
            </label>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ ...btnSecondary, flex: 1, justifyContent: "center", padding: "10px 16px" }}>Voltar</button>
            <button onClick={onSubmit} style={{ ...btnPrimary, flex: 2 }}>Solicitar feedback</button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#414651", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", appearance: "none",
          border: "1px solid #D5D7DA", borderRadius: 10,
          padding: "10px 36px 10px 12px",
          fontSize: 14, color: value ? "#181D27" : "#A4A7AE",
          background: "#fff", outline: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(90deg)", color: "#535862", pointerEvents: "none" }} />
    </div>
  );
}

// ─── Success Modal ───────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: 480, maxWidth: "90vw", boxShadow: "0 20px 64px rgba(10,13,18,0.25)", padding: 32, textAlign: "center" }}>
        <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#D1FADF", opacity: 0.4 }} />
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: "#A6F4C5", opacity: 0.6 }} />
          <div style={{ position: "absolute", inset: 16, borderRadius: "50%", background: "#fff", border: "3px solid #039855", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={28} color="#039855" strokeWidth={3} />
          </div>
        </div>
        <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, color: "#181D27" }}>Solicitação enviada!</h3>
        <p style={{ margin: 0, fontSize: 14, color: "#535862", lineHeight: "20px" }}>
          Seu pedido de feedback foi registrado e enviado com sucesso.
        </p>
        <p style={{ margin: "16px 0 24px", fontSize: 14, color: "#535862", lineHeight: "20px" }}>
          Os participantes receberão uma notificação para responder o feedback.
        </p>
        <div style={{ borderTop: "1px solid #E9EAEB", paddingTop: 20 }}>
          <button onClick={onClose} style={btnPrimary}>Concluir</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Modal Overlay ───────────────────────────────────────────────────────────
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(16, 24, 40, 0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

// ─── Empty Tab Placeholder ───────────────────────────────────────────────────
function EmptyTab({ tab }: { tab: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: "80px 32px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Sparkles size={24} color="#A4A7AE" />
      </div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#181D27" }}>Conteúdo em breve</h3>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: "#717680" }}>A aba {tab} está sendo preparada para você.</p>
    </div>
  );
}

// ─── Shared button styles ────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  width: "100%", padding: "12px 20px",
  background: "#1570EF", color: "#fff",
  border: "none", borderRadius: 10,
  fontSize: 14, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit",
};

const btnPrimaryLight: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 14px",
  background: "#EFF8FF", color: "#1570EF",
  border: "1px solid #B2DDFF", borderRadius: 8,
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit",
};

const btnSecondary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 14px",
  background: "#fff", color: "#414651",
  border: "1px solid #D5D7DA", borderRadius: 8,
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit",
};

const btnIcon: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32,
  background: "#fff",
  border: "1px solid #D5D7DA", borderRadius: 8,
  cursor: "pointer",
  padding: 0,
};

const btnIconSmall: React.CSSProperties = {
  ...btnIcon,
  width: 28, height: 28,
};

const btnIconBare: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32,
  background: "transparent",
  border: "none", borderRadius: 8, cursor: "pointer",
  padding: 0,
};

// ─── Main ───────────────────────────────────────────────────────────────────
const MainContent = () => {
  const [activeTab, setActiveTab] = useState("Agenda");
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <main style={{ flex: 1, overflowY: "auto", background: "#F5F5F5" }} className="thin-scrollbar">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px 32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 16 }}>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 600, color: "#272A31", fontSize: 30, lineHeight: "38px" }}>
            Módulo Início
          </Typography.Title>
          <Typography.Text style={{ fontSize: 14, color: "#717680" }}>
            Seu Feed de informações e interações
          </Typography.Text>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 20, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: "12px 16px" }}>
          <Segmented
            options={[
              { label: "Timeline", value: "Timeline" },
              { label: "Aniversariantes", value: "Aniversariantes" },
              { label: "Agenda", value: "Agenda" },
              { label: "Vagas", value: "Vagas" },
            ]}
            value={activeTab}
            onChange={(v) => setActiveTab(v as string)}
            style={{ background: "#F5F5F5" }}
          />
        </div>

        {/* Content */}
        {activeTab === "Agenda" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "flex-start" }}>
            <CalendarCard onEventClick={() => setModal("eventDetails")} />
            <PendenciasSidebar />
          </div>
        ) : (
          <EmptyTab tab={activeTab} />
        )}
      </div>

      {modal === "eventDetails" && (
        <EventDetailsModal
          onClose={() => setModal(null)}
          onSolicitar={() => setModal("feedbackForm")}
        />
      )}
      {modal === "feedbackForm" && (
        <FeedbackRequestModal
          onClose={() => setModal(null)}
          onSubmit={() => setModal("success")}
        />
      )}
      {modal === "success" && <SuccessModal onClose={() => setModal(null)} />}
    </main>
  );
};

export default MainContent;
