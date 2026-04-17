import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar, Flex, Typography } from "antd";
import { ArrowRight, Check, Hash, Search, Send, Share2, X } from "lucide-react";
import { avatar } from "@/lib/avatar";

interface SharePostModalProps {
  open: boolean;
  onClose: () => void;
  postAuthor?: string;
  postContent?: string;
}

const COLLEAGUES = [
  { name: "Ana Costa",        role: "UX Researcher" },
  { name: "Carlos Mendes",    role: "Engenheiro de Software" },
  { name: "Fernanda Lima",    role: "Product Manager" },
  { name: "Rafael Souza",     role: "Tech Lead" },
  { name: "Juliana Rocha",    role: "Designer UX/UI" },
  { name: "Pedro Alves",      role: "Gerente de Projetos" },
  { name: "Camila Torres",    role: "Analista de Dados" },
  { name: "Diego Ferreira",   role: "Desenvolvedor Front-end" },
  { name: "Mariana Oliveira", role: "Especialista em Marketing" },
  { name: "Joan Pierre",      role: "Content Strategist" },
];

const CHANNELS = [
  { name: "design-geral",   label: "Design Geral" },
  { name: "produto",        label: "Produto" },
  { name: "engenharia",     label: "Engenharia" },
  { name: "marketing",      label: "Marketing" },
  { name: "geral",          label: "Geral" },
];

type Recipient = { id: string; type: "person" | "channel"; label: string };

const SharePostModal = ({ open, onClose, postAuthor, postContent }: SharePostModalProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recipient[]>([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setSearch(""); setSelected([]); setMessage(""); setSent(false); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  if (!open) return null;

  const filteredColleagues = COLLEAGUES.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) && !selected.find(s => s.id === c.name)
  );
  const filteredChannels = CHANNELS.filter(
    c => (c.label.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())) && !selected.find(s => s.id === c.name)
  );

  const addPerson = (name: string) => {
    setSelected(prev => [...prev, { id: name, type: "person", label: name }]);
    setSearch("");
    inputRef.current?.focus();
  };

  const addChannel = (name: string, label: string) => {
    setSelected(prev => [...prev, { id: name, type: "channel", label }]);
    setSearch("");
    inputRef.current?.focus();
  };

  const remove = (id: string) => setSelected(prev => prev.filter(s => s.id !== id));

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onClose(); }, 1400);
  };

  const showDropdown = search.length > 0 && (filteredColleagues.length > 0 || filteredChannels.length > 0);
  const truncatedContent = postContent && postContent.length > 120 ? postContent.slice(0, 120).trimEnd() + "..." : postContent;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(52,64,84,0.6)" }} />

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 560, background: "#fff", borderRadius: 16, boxShadow: "0 24px 80px rgba(10,13,18,0.22)", border: "1px solid #E9EAEB", display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "90vh" }}>

        {/* Header */}
        <Flex align="center" justify="space-between" style={{ padding: "20px 28px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
          <Flex align="center" gap={14}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Share2 size={20} color="#1570EF" />
            </div>
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "26px" }}>
                Compartilhar publicação
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#717680" }}>
                Envie para colegas ou canais com uma mensagem
              </Typography.Text>
            </div>
          </Flex>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={18} color="#A4A7AE" />
          </button>
        </Flex>

        {/* Body */}
        <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }} className="thin-scrollbar">

          {/* Post preview */}
          {(postAuthor || postContent) && (
            <div style={{ background: "#F9FAFB", border: "1px solid #E9EAEB", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              {postAuthor && (
                <Flex align="center" gap={8} style={{ marginBottom: 6 }}>
                  <Avatar src={avatar(postAuthor)} size={22} />
                  <Typography.Text strong style={{ fontSize: 12, color: "#344054" }}>{postAuthor}</Typography.Text>
                </Flex>
              )}
              {truncatedContent && (
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>{truncatedContent}</Typography.Text>
              )}
            </div>
          )}

          {/* Para (recipients) */}
          <div style={{ marginBottom: 16 }}>
            <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#414651", display: "block", marginBottom: 6 }}>Para</Typography.Text>
            <div style={{ border: "1px solid #D0D5DD", borderRadius: 10, padding: "6px 10px", minHeight: 44, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", position: "relative" }}
              onClick={() => inputRef.current?.focus()}
            >
              {selected.map(s => (
                <span key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EFF8FF", border: "1px solid #B2DDFF", borderRadius: 20, padding: "3px 10px 3px 6px", fontSize: 13, color: "#1570EF", fontWeight: 500 }}>
                  {s.type === "person"
                    ? <Avatar src={avatar(s.label)} size={18} />
                    : <Hash size={12} color="#1570EF" />}
                  {s.type === "channel" ? `#${s.label}` : s.label}
                  <button onClick={e => { e.stopPropagation(); remove(s.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#1570EF", lineHeight: 1 }}>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={selected.length === 0 ? "Buscar pessoas ou canais..." : ""}
                style={{ flex: 1, minWidth: 120, border: "none", outline: "none", fontSize: 13, color: "#344054", fontFamily: "inherit", background: "transparent", padding: "2px 0" }}
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div style={{ border: "1px solid #E9EAEB", borderRadius: 10, background: "#fff", boxShadow: "0 4px 16px rgba(10,13,18,0.10)", marginTop: 4, overflow: "hidden", maxHeight: 240, overflowY: "auto" }} className="thin-scrollbar">
                {filteredColleagues.length > 0 && (
                  <>
                    <div style={{ padding: "8px 12px 4px", fontSize: 11, fontWeight: 600, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pessoas</div>
                    {filteredColleagues.map(c => (
                      <button key={c.name} onClick={() => addPerson(c.name)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        <Avatar src={avatar(c.name)} size={32} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#101828" }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "#667085" }}>{c.role}</div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
                {filteredChannels.length > 0 && (
                  <>
                    <div style={{ padding: "8px 12px 4px", fontSize: 11, fontWeight: 600, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.05em" }}>Canais</div>
                    {filteredChannels.map(c => (
                      <button key={c.name} onClick={() => addChannel(c.name, c.label)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF8FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Hash size={15} color="#1570EF" />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#101828" }}>#{c.label}</div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#414651", display: "block", marginBottom: 6 }}>Mensagem <span style={{ color: "#98A2B3", fontWeight: 400 }}>(opcional)</span></Typography.Text>

            {/* Templates */}
            <Flex gap={6} wrap="wrap" style={{ marginBottom: 8 }}>
              {([
                { label: "Achei interessante!", body: "Olha isso, achei super interessante e relevante pro nosso contexto. Vale a pena dar uma olhada quando puder!" },
                { label: "Discutir no time", body: "Pessoal, precisamos discutir isso no time. Acho que tem pontos importantes que podem impactar nosso trabalho. Vamos agendar um papo?" },
                { label: "Relevante pra você", body: "Vi esse conteúdo e lembrei de você! Acho que tem tudo a ver com o que você está trabalhando. Dá uma olhada e me diz o que acha." },
                { label: "O que acham?", body: "Queria a opinião de vocês sobre isso. Acho que pode ser uma boa oportunidade pra gente explorar. O que acham? Faz sentido pra nossa realidade?" },
              ]).map(t => (
                <button
                  key={t.label}
                  onClick={() => setMessage(t.body)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid #E9EAEB", background: "#F9FAFB", fontSize: 12, color: "#535862", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s, border-color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF8FF"; e.currentTarget.style.borderColor = "#B2DDFF"; e.currentTarget.style.color = "#1570EF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#E9EAEB"; e.currentTarget.style.color = "#535862"; }}
                >
                  {t.label}
                </button>
              ))}
            </Flex>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Adicione uma mensagem personalizada..."
              rows={3}
              style={{ width: "100%", border: "1px solid #D0D5DD", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#344054", fontFamily: "inherit", lineHeight: "22px", resize: "none", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#1570EF")}
              onBlur={e => (e.currentTarget.style.borderColor = "#D0D5DD")}
            />
          </div>
        </div>

        {/* Footer */}
        <Flex align="center" justify="flex-end" gap={12} style={{ padding: "14px 28px", borderTop: "1px solid #E9EAEB", flexShrink: 0 }}>
          <button onClick={onClose} style={secondaryBtnStyle}>Cancelar</button>
          <button
            onClick={handleSend}
            disabled={selected.length === 0 || sent}
            style={{ ...primaryBtnStyle, opacity: selected.length === 0 ? 0.5 : 1, cursor: selected.length === 0 ? "not-allowed" : "pointer", minWidth: 110, justifyContent: "center" }}
          >
            {sent
              ? <><Check size={15} /> Enviado!</>
              : <><Send size={15} /> Compartilhar</>}
          </button>
        </Flex>
      </div>
    </div>,
    document.body
  );
};

const closeBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "none", border: "none", cursor: "pointer", borderRadius: 8, padding: 0 };
const secondaryBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 14, fontWeight: 500, color: "#344054", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" };
const primaryBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)", transition: "opacity 0.15s" };

export default SharePostModal;
