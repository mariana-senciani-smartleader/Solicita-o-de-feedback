import { useState, useEffect } from "react";
import { Segmented, Typography } from "antd";
import {
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
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
  Users,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Target,
  Play,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

export type StarterPoint = "agenda" | "one-on-one";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const attendees = [
  { name: "Rafaela Monteiro",  email: "rafaela.monteiro@smartleader.com.br",  role: "Organizador", initials: "R", color: "#F79009" },
  { name: "Guilherme Farias",  email: "guilherme.farias@smartleader.com.br",  role: "Convidado",   initials: "G", color: "#667085" },
  { name: "Isabela Carvalho",  email: "isabela.carvalho@smartleader.com.br",  role: "Convidado",   initials: "I", color: "#98A2B3" },
];

const pendencias = [
  { text: "Você tem pendências da", highlight: "Teste PDI no resultado - 2207 0505." },
  { text: "Você tem pendências da", highlight: "Prontidão." },
  { text: "Você tem pendências da", highlight: "AVALIAÇÃO DE COMPETÊNCIAS 2025 - Bia." },
  { text: "Você tem pendências da", highlight: "AVALIAÇÃO TESTE ABA FECHANDO." },
];

const colaboradores = [
  "Rafaela Monteiro",
  "Guilherme Farias",
  "Isabela Carvalho",
  "Thiago Nascimento",
  "Camila Rezende",
  "Lucas Drummond",
  "Fernanda Peixoto",
  "André Cavalcanti",
  "Juliana Teixeira",
  "Rodrigo Menezes",
  "Priscila Barbosa",
  "Felipe Azevedo",
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
              </div>
            ))}
          </div>
          <button style={btnIconSmall}><ChevronRight size={14} color="#535862" /></button>
        </div>
      </div>

      {/* Info alert */}
      <div style={{
        marginTop: 20,
        display: "flex", alignItems: "flex-start", gap: 12,
        background: "#fff", border: "1px solid #E9EAEB", borderRadius: 12,
        padding: "12px 16px",
      }}>
        {/* Icon with concentric rings */}
        <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#EFF8FF", opacity: 0.5 }} />
          <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "#EFF8FF" }} />
          <div style={{ position: "relative", width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #1570EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1570EF", lineHeight: 1 }}>i</span>
          </div>
        </div>
        <div style={{ paddingTop: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#181D27", marginBottom: 2 }}>
            Acesse detalhes e solicite feedbacks
          </div>
          <div style={{ fontSize: 13, color: "#535862", lineHeight: "18px" }}>
            Clique em qualquer evento para ver mais informações sobre a reunião e solicitar feedbacks aos participantes.
          </div>
        </div>
      </div>

      {/* Events list */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Event 1 — Daily Design 09:30 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#535862", marginTop: 12, minWidth: 40 }}>09:30</span>
          <div
            onClick={onEventClick}
            style={{
              flex: 1, background: "#EFF8FF",
              border: "1px solid #B2DDFF", borderLeft: "3px solid #1570EF", borderRadius: 10,
              padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Calendar size={14} color="#1570EF" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1570EF" }}>Daily Design</span>
              </div>
              <div style={{ fontSize: 12, color: "#535862" }}>09:30 até 10:00</div>
            </div>
            <div style={{ display: "flex" }}>
              {attendees.map((a, i) => (
                <div key={a.initials} style={{ width: 28, height: 28, borderRadius: "50%", background: a.color, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, marginLeft: i === 0 ? 0 : -8 }}>
                  {a.initials}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event 2 — Reunião de Produto 11:00 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#535862", marginTop: 12, minWidth: 40 }}>11:00</span>
          <div
            onClick={onEventClick}
            style={{
              flex: 1, background: "#EFF8FF",
              border: "1px solid #B2DDFF", borderLeft: "3px solid #1570EF", borderRadius: 10,
              padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Calendar size={14} color="#1570EF" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1570EF" }}>Reunião de Produto</span>
              </div>
              <div style={{ fontSize: 12, color: "#535862" }}>11:00 até 11:45</div>
            </div>
            <div style={{ display: "flex" }}>
              {[
                { initials: "R", color: "#F79009" },
                { initials: "T", color: "#7F56D9" },
                { initials: "C", color: "#039855" },
              ].map((a, i) => (
                <div key={a.initials} style={{ width: 28, height: 28, borderRadius: "50%", background: a.color, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, marginLeft: i === 0 ? 0 : -8 }}>
                  {a.initials}
                </div>
              ))}
            </div>
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
      <div style={{ background: "#fff", borderRadius: 16, width: 680, maxWidth: "92vw", overflow: "hidden", boxShadow: "0 20px 64px rgba(10,13,18,0.25)" }}>
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
              <SelectInput value={recipient} onChange={setRecipient} placeholder="Selecione os colaboradores" options={colaboradores} />
            </FormField>
          )}

          <FormField label={type === "sobreTopico" ? "Quem você quer que responda?" : "Quem você quer que ofereça o feedback?"}>
            <SelectInput value={provider} onChange={setProvider} placeholder="Selecione os colaboradores" options={colaboradores} />
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
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          border: `1px solid ${open ? "#1570EF" : "#D5D7DA"}`,
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 14,
          color: value ? "#181D27" : "#A4A7AE",
          background: "#fff",
          outline: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: open ? "0 0 0 3px rgba(21,112,239,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          color="#667085"
          style={{ flexShrink: 0, marginLeft: 8, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}
        />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 299 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 300,
            background: "#fff", borderRadius: 10,
            border: "1px solid #E9EAEB",
            boxShadow: "0 8px 24px rgba(10,13,18,0.12)",
            maxHeight: 220, overflowY: "auto",
          }}>
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "10px 14px",
                  border: "none",
                  background: value === o ? "#EFF8FF" : "#fff",
                  fontSize: 14, fontWeight: value === o ? 600 : 400,
                  color: value === o ? "#1570EF" : "#344054",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (value !== o) (e.currentTarget as HTMLButtonElement).style.background = "#FAFAFA"; }}
                onMouseLeave={(e) => { if (value !== o) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
              >
                <span>{o}</span>
                {value === o && <Check size={14} color="#1570EF" strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Success Modal ───────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, width: 480, maxWidth: "90vw", boxShadow: "0 20px 64px rgba(10,13,18,0.25)", padding: "24px 24px 24px", textAlign: "center" }}>
        {/* Circle with subtle outer halo — matches reference */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#DCFAE6",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.5 12.5L10.5 15.5L16.5 9.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="#079455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, color: "#181D27" }}>
          Solicitação enviada!
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#535862", lineHeight: "20px" }}>
          Seu pedido de feedback foi registrado e enviado com sucesso. Os participantes receberão uma notificação para responder o feedback.
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px 20px",
            background: "#1570EF", color: "#fff",
            border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Concluir
        </button>
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

// ─── Starter Point Dropdown ──────────────────────────────────────────────────
function StarterDropdown({
  value,
  onChange,
}: {
  value: StarterPoint;
  onChange: (v: StarterPoint) => void;
}) {
  const [open, setOpen] = useState(false);

  const options: { value: StarterPoint; label: string }[] = [
    { value: "agenda", label: "Agenda Integrada" },
    { value: "one-on-one", label: "1:1" },
  ];

  const current = options.find((o) => o.value === value)!;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px",
          background: "#fff", color: "#344054",
          border: "1px solid #D5D7DA", borderRadius: 8,
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 1px 2px rgba(10,13,18,0.05)",
        }}
      >
        {current.label}
        <ChevronDown size={16} color="#667085" />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100,
            background: "#fff", borderRadius: 10, border: "1px solid #E9EAEB",
            boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 180, overflow: "hidden",
          }}>
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", border: "none",
                  background: value === o.value ? "#F5F8FF" : "#fff",
                  fontSize: 14, fontWeight: value === o.value ? 600 : 400,
                  color: value === o.value ? "#1570EF" : "#344054",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
              >
                {value === o.value && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1570EF", flexShrink: 0 }} />
                )}
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── One-on-One View ──────────────────────────────────────────────────────────
type InnerTab = "1:1s" | "Histórico" | "Configurações";

const reunioesAvatars = {
  eve:     "/assets/avatar-mariana-oliveira.png",
  candice: "/assets/avatar-fernanda-lima.png",
  drew:    "/assets/avatar-bruno-delorence.png",
  andi:    "/assets/avatar-juliana-rocha.png",
  natalie: "/assets/avatar-camila-torres.png",
  lory:    "/assets/avatar-ana-costa.png",
};

function OneOnOneView({ onSolicitar }: { onSolicitar: () => void }) {
  const [innerTab, setInnerTab] = useState<InnerTab>("1:1s");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", overflow: "hidden" }}>
      {/* Inner tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 24px 0", borderBottom: "1px solid #E9EAEB" }}>
        {(["1:1s", "Histórico", "Configurações"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setInnerTab(t)}
            style={{
              position: "relative",
              padding: "10px 16px",
              border: "none", background: "transparent",
              fontFamily: "inherit", fontSize: 14, fontWeight: 600,
              color: innerTab === t ? "#1570EF" : "#717680",
              cursor: "pointer",
              borderRadius: innerTab === t ? "8px 8px 0 0" : 0,
              backgroundColor: innerTab === t ? "#F5F8FF" : "transparent",
            }}
          >
            {t}
            {innerTab === t && (
              <span style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: "#1570EF" }} />
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          <StatCard
            icon={<Target size={20} color="#079455" />}
            iconBg="#ECFDF3"
            label="1:1s completos"
            value="05"
            suffix="/08"
          />
          <StatCard
            icon={<Calendar size={20} color="#1570EF" />}
            iconBg="#EFF8FF"
            label="Reuniões da semana"
            value="12"
          />
          <StatCard
            icon={<AlertTriangle size={20} color="#DC6803" />}
            iconBg="#FFFAEB"
            label="Pendente de preparação"
            value="4"
            valueColor="#DC6803"
          />
          <StatCard
            icon={<Users size={20} color="#1570EF" />}
            iconBg="#EFF8FF"
            label="Time"
            value="8"
          />
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, border: "1px solid #D5D7DA", borderRadius: 8, padding: "8px 12px", background: "#fff" }}>
            <Search size={16} color="#A4A7AE" />
            <span style={{ fontSize: 14, color: "#A4A7AE" }}>Pesquisar...</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>
            <SlidersHorizontal size={15} color="#344054" />
            Smartfilter
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>
            Outubro <ChevronDown size={15} color="#667085" />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#1570EF", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
            <Plus size={16} />
            Nova reunião
          </button>
        </div>

        {/* Kanban */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {/* Sem agendamento */}
          <KanbanColumn
            icon={
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#FEE4E2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={11} color="#D92D20" strokeWidth={2.5} />
              </span>
            }
            title="Sem agendamento"
            count={2}
          >
            <SemAgendamentoCard avatar={reunioesAvatars.eve} name="Eve Leroy" role="UX researcher" days={19} />
            <SemAgendamentoCard avatar={reunioesAvatars.candice} name="Candice Wu" role="Product Manager" days={32} />
          </KanbanColumn>

          {/* Agendadas */}
          <KanbanColumn
            icon={
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#EFF8FF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={11} color="#1570EF" strokeWidth={2.5} />
              </span>
            }
            title="Agendadas"
            count={4}
          >
            <AgendadaCard
              id="agend-1"
              avatar={reunioesAvatars.drew}
              name="Drew Cano"
              role="UX researcher"
              title="Alinhamento semanal"
              date="13 out 2025"
              time="09:00 - 09:30"
              status="necessita"
              menuOpen={openMenuId === "agend-1"}
              onMenuToggle={() => setOpenMenuId(openMenuId === "agend-1" ? null : "agend-1")}
            />
            <AgendadaCard
              id="agend-2"
              avatar={reunioesAvatars.andi}
              name="Andi Lane"
              role="UX researcher"
              title="Planejamento Q1 2026"
              date="13 out 2025"
              time="09:00 - 09:30"
              status="preparada"
              menuOpen={false}
              onMenuToggle={() => {}}
            />
            <AgendadaCard
              id="agend-3"
              avatar={reunioesAvatars.natalie}
              name="Natalie Craig"
              role="UX researcher"
              title="Alinhamento semanal"
              date="13 out 2025"
              time="09:00 - 09:30"
              status="preparada"
              menuOpen={false}
              onMenuToggle={() => {}}
            />
          </KanbanColumn>

          {/* A seguir */}
          <KanbanColumn
            icon={
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#EFF8FF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={10} color="#1570EF" fill="#1570EF" strokeWidth={2.5} />
              </span>
            }
            title="A seguir"
            count={2}
          >
            <ASeguirCard
              avatar={reunioesAvatars.drew}
              name="Drew Cano"
              role="UX researcher"
              title="Alinhamento semanal"
              date="13 out 2025"
              time="09:00 - 09:30"
              isAgora
              status="necessita"
              primary
            />
            <ASeguirCard
              avatar={reunioesAvatars.lory}
              name="Lory Bryson"
              role="UX researcher"
              title="Alinhamento semanal"
              date="13 out 2025"
              time="10:00 - 10:30"
              status="preparada"
            />
            <ASeguirCard
              avatar={reunioesAvatars.lory}
              name="Lory Bryson"
              role="UX researcher"
              title="Alinhamento semanal"
              date="13 out 2025"
              time="10:00 - 10:30"
              status="naoConcluida"
            />
          </KanbanColumn>

          {/* Concluídas */}
          <KanbanColumn
            icon={
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#ECFDF3", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={11} color="#079455" strokeWidth={3} />
              </span>
            }
            title="Concluídas"
            count={1}
          >
            <ConcluidaCard onSolicitar={onSolicitar} />
          </KanbanColumn>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, suffix, valueColor = "#181D27" }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; suffix?: string; valueColor?: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, color: "#717680", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: valueColor, lineHeight: 1 }}>
          {value}
          {suffix && <span style={{ fontSize: 16, fontWeight: 500, color: "#A4A7AE", marginLeft: 2 }}>{suffix}</span>}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ icon, title, count, children }: {
  icon: React.ReactNode; title: string; count: number; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#FAFAFA", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 4px 8px" }}>
        {icon}
        <span style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>{title}</span>
        <span style={{ background: "#F2F4F7", color: "#344054", fontSize: 12, fontWeight: 600, padding: "1px 8px", borderRadius: 6, border: "1px solid #E9EAEB" }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function PersonHeader({ avatar, name, role }: { avatar: string; name: string; role: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <img src={avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "#F2F4F7" }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}>{name}</div>
        <div style={{ fontSize: 12, color: "#717680" }}>{role}</div>
      </div>
    </div>
  );
}

function SemAgendamentoCard({ avatar, name, role, days }: { avatar: string; name: string; role: string; days: number }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", padding: 16 }}>
      <PersonHeader avatar={avatar} name={name} role={role} />
      <div style={{ background: "#FFFAEB", border: "1px solid #FEDF89", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <AlertTriangle size={16} color="#DC6803" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#93370D" }}>Sem reunião este mês</div>
            <div style={{ fontSize: 12, color: "#B54708", marginTop: 2, lineHeight: "16px" }}>
              Faz {days} dias que você não tem uma reunião com {name.split(" ")[0]}
            </div>
          </div>
        </div>
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", padding: "8px 12px", background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1570EF", cursor: "pointer", fontFamily: "inherit" }}>
        <Calendar size={14} color="#1570EF" />
        Agendar reunião
      </button>
    </div>
  );
}

type StatusType = "necessita" | "preparada" | "naoConcluida";

function StatusBadge({ status }: { status: StatusType }) {
  if (status === "necessita") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FFFAEB", color: "#B54708", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid #FEDF89" }}>
        <AlertTriangle size={11} />
        Necessita de preparo
      </span>
    );
  }
  if (status === "preparada") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ECFDF3", color: "#067647", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid #ABEFC6" }}>
        <Check size={11} strokeWidth={3} />
        Preparada
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF3F2", color: "#B42318", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid #FECDCA" }}>
      <Clock size={11} />
      Não concluída
    </span>
  );
}

function MeetingMeta({ date, time }: { date: string; time: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#717680", marginBottom: 10, flexWrap: "wrap" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Calendar size={12} color="#A4A7AE" />{date}
      </span>
      <span style={{ color: "#D5D7DA" }}>•</span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Clock size={12} color="#A4A7AE" />{time}
      </span>
    </div>
  );
}

function AgendadaCard({
  id, avatar, name, role, title, date, time, status, menuOpen, onMenuToggle,
}: {
  id: string; avatar: string; name: string; role: string; title: string; date: string; time: string;
  status: StatusType; menuOpen: boolean; onMenuToggle: () => void;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", padding: 16, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <PersonHeader avatar={avatar} name={name} role={role} />
        <button onClick={onMenuToggle} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, marginRight: -4, marginTop: -4 }}>
          <MoreVertical size={16} color="#667085" />
        </button>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 8 }}>{title}</div>
      <MeetingMeta date={date} time={time} />
      <div style={{ marginBottom: 12 }}>
        <StatusBadge status={status} />
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 6, padding: 0, background: "transparent", border: "none", fontSize: 13, fontWeight: 600, color: "#1570EF", cursor: "pointer", fontFamily: "inherit" }}>
        Preparar reunião
        <ArrowRight size={14} />
      </button>

      {menuOpen && (
        <>
          <div onClick={onMenuToggle} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
          <div style={{ position: "absolute", top: 36, right: 12, zIndex: 51, background: "#fff", border: "1px solid #E9EAEB", borderRadius: 10, boxShadow: "0 8px 24px rgba(10,13,18,0.12)", minWidth: 160, overflow: "hidden" }}>
            <MenuItem icon={<Pencil size={14} />}>Editar</MenuItem>
            <MenuItem icon={<Play size={14} fill="currentColor" />}>Iniciar</MenuItem>
            <MenuItem icon={<Trash2 size={14} />} danger>Excluir reunião</MenuItem>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon, children, danger }: { icon: React.ReactNode; children: React.ReactNode; danger?: boolean }) {
  return (
    <button style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "10px 14px", border: "none", background: "#fff", cursor: "pointer",
      fontFamily: "inherit", fontSize: 14, fontWeight: 500,
      color: danger ? "#D92D20" : "#344054",
      textAlign: "left",
    }}>
      {icon}
      {children}
    </button>
  );
}

function ASeguirCard({
  avatar, name, role, title, date, time, isAgora, status, primary,
}: {
  avatar: string; name: string; role: string; title: string; date: string; time: string;
  isAgora?: boolean; status: StatusType; primary?: boolean;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <PersonHeader avatar={avatar} name={name} role={role} />
        {isAgora && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#D92D20" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D92D20" }} />
            AGORA
          </span>
        )}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 8 }}>{title}</div>
      <MeetingMeta date={date} time={time} />
      <div style={{ marginBottom: 12 }}>
        <StatusBadge status={status} />
      </div>
      {primary ? (
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px 12px", background: "#1570EF", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
          Iniciar agora <Play size={13} fill="#fff" />
        </button>
      ) : (
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px 12px", background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#344054", cursor: "pointer", fontFamily: "inherit" }}>
          Iniciar agora <Play size={13} color="#344054" fill="#344054" />
        </button>
      )}
    </div>
  );
}

function ConcluidaCard({ onSolicitar }: { onSolicitar: () => void }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E9EAEB", padding: 16 }}>
      <PersonHeader avatar={reunioesAvatars.lory} name="Lory Bryson" role="UX researcher" />
      <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 8 }}>Alinhamento semanal</div>
      <MeetingMeta date="13 out 2025" time="10:00 - 10:30" />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ECFDF3", color: "#067647", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid #ABEFC6", marginBottom: 12 }}>
        <Check size={11} strokeWidth={3} />
        Concluída
      </span>
      <div>
        <button
          onClick={onSolicitar}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: 0, background: "transparent", border: "none", fontSize: 13, fontWeight: 600, color: "#1570EF", cursor: "pointer", fontFamily: "inherit" }}
        >
          <MessageSquare size={14} />
          Solicitar feedback
        </button>
      </div>
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
interface MainContentProps {
  starter: StarterPoint;
  setStarter: (v: StarterPoint) => void;
}

const MainContent = ({ starter, setStarter }: MainContentProps) => {
  const isOneOnOne = starter === "one-on-one";
  const [activeTab, setActiveTab] = useState<string>(isOneOnOne ? "1:1s" : "Agenda");
  const [modal, setModal] = useState<ModalState>(null);

  const handleStarterChange = (v: StarterPoint) => {
    setStarter(v);
    setActiveTab(v === "one-on-one" ? "1:1s" : "Agenda");
  };

  const tabOptions = isOneOnOne
    ? [
        { label: "1:1s", value: "1:1s" },
        { label: "Histórico", value: "Histórico" },
      ]
    : [
        { label: "Timeline", value: "Timeline" },
        { label: "Aniversariantes", value: "Aniversariantes" },
        { label: "Agenda", value: "Agenda" },
        { label: "Vagas", value: "Vagas" },
      ];

  return (
    <main style={{ flex: 1, overflowY: "auto", background: "#F5F5F5" }} className="thin-scrollbar">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px 32px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 16 }}>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 600, color: "#272A31", fontSize: 30, lineHeight: "38px" }}>
            {isOneOnOne ? "Reuniões" : "Módulo Início"}
          </Typography.Title>
          <Typography.Text style={{ fontSize: 14, color: "#717680" }}>
            {isOneOnOne
              ? "Estruture encontros produtivos com pauta clara, registro de decisões e acompanhamento de planos de ação."
              : "Seu Feed de informações e interações"}
          </Typography.Text>
        </div>

        {/* Tabs + Dropdown */}
        <div style={{ marginBottom: 20, background: "#fff", borderRadius: 16, border: "1px solid #E9EAEB", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Segmented
            options={tabOptions}
            value={activeTab}
            onChange={(v) => setActiveTab(v as string)}
            style={{ background: "#F5F5F5" }}
          />
          {(isOneOnOne || activeTab === "Agenda") && (
            <StarterDropdown value={starter} onChange={handleStarterChange} />
          )}
        </div>

        {/* Content */}
        {isOneOnOne ? (
          activeTab === "1:1s" ? (
            <OneOnOneView onSolicitar={() => setModal("feedbackForm")} />
          ) : (
            <EmptyTab tab={activeTab} />
          )
        ) : activeTab === "Agenda" ? (
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
