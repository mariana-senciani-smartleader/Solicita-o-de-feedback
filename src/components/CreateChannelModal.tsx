import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flex, Input, Modal, Switch, Typography } from "antd";
import {
  AlignLeft, ArrowRight, Bell, Bold, BookOpen, Briefcase,
  Camera, Check, ChevronDown, ChevronRight, Code2, Coffee,
  Gift, Globe, Hash, Headphones, Heart, Image, List,
  Megaphone, MessageCirclePlus, Music, Pen, Plus, Redo2, Rocket, Scale,
  Search, Shield, Sparkles, Star, Target, Undo2, X, Zap,
  Banknote,
} from "lucide-react";
import { AddMembersStep } from "./AddMembersStep";

export type ChannelFormData = { name: string; icon: React.ElementType; color: string };

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: (data: ChannelFormData) => void;
  onCreateChannel?: (data: ChannelFormData) => void;
}

const COLORS = [
  "#1570EF", "#7839EE", "#6941C6", "#D92D20", "#E04F16",
  "#CA8504", "#2D9D92", "#079455", "#099250", "#0BA5EC",
  "#2E90FA", "#444CE7", "#3538CD", "#1849A9",
  "#53B1FD", "#B692F6", "#D6BBFB", "#FDA29B", "#FDB022",
  "#A6EF67", "#32D583", "#67E3F9", "#84CAFF", "#A4BCFD",
];

const ICONS: { name: string; icon: React.ElementType }[] = [
  { name: "Balança", icon: Scale },
  { name: "Código", icon: Code2 },
  { name: "Dinheiro", icon: Banknote },
  { name: "Fone de ouvido", icon: Headphones },
  { name: "Hashtag", icon: Hash },
  { name: "Megafone", icon: Megaphone },
  { name: "Estrela", icon: Star },
  { name: "Coração", icon: Heart },
  { name: "Foguete", icon: Rocket },
  { name: "Global", icon: Globe },
  { name: "Sino", icon: Bell },
  { name: "Raio", icon: Zap },
  { name: "Escudo", icon: Shield },
  { name: "Alvo", icon: Target },
  { name: "Livro", icon: BookOpen },
  { name: "Pasta", icon: Briefcase },
  { name: "Câmera", icon: Camera },
  { name: "Café", icon: Coffee },
  { name: "Presente", icon: Gift },
  { name: "Música", icon: Music },
];

/* ── Icon + colour picker ── */
const IconColorPicker = ({
  selectedColor, selectedIconName, onColorSelect, onIconSelect,
}: {
  selectedColor: string; selectedIconName: string;
  onColorSelect: (c: string) => void; onIconSelect: (n: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = ICONS.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ width: 260, background: "#fff", border: "1px solid #E9EAEB", borderRadius: 16, boxShadow: "0 8px 24px rgba(10,13,18,0.12)", overflow: "hidden" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #E9EAEB" }}>
        <Flex wrap="wrap" gap={6}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              style={{ width: 24, height: 24, borderRadius: "50%", background: color, border: selectedColor === color ? "2px solid #fff" : "none", boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {selectedColor === color && <Check size={11} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </Flex>
      </div>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #E9EAEB" }}>
        <Flex align="center" gap={8} style={{ background: "#F5F5F5", borderRadius: 8, padding: "6px 10px" }}>
          <Search size={13} color="#A4A7AE" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar ícone" style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#181D27", width: "100%", fontFamily: "inherit" }} />
        </Flex>
      </div>
      <div style={{ maxHeight: 160, overflowY: "auto" }} className="thin-scrollbar">
        {filtered.length === 0 && <div style={{ padding: "16px 12px", textAlign: "center", color: "#A4A7AE", fontSize: 13 }}>Nenhum ícone encontrado</div>}
        {filtered.map(({ name, icon: Icon }) => (
          <button key={name} onClick={() => onIconSelect(name)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "6px 12px", background: selectedIconName === name ? "#F5F5F5" : "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 14, color: "#414651", transition: "background 0.1s" }} onMouseEnter={(e) => { if (selectedIconName !== name) e.currentTarget.style.background = "#FAFAFA"; }} onMouseLeave={(e) => { if (selectedIconName !== name) e.currentTarget.style.background = "transparent"; }}>
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

/* ── Modal ── */
const CreateChannelModal = ({ open, onOpenChange, onNext, onCreateChannel }: CreateChannelModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [channelData, setChannelData] = useState<ChannelFormData | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [moderatorsOnly, setModeratorsOnly] = useState(true);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#079455");
  const [selectedIconName, setSelectedIconName] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedIconObj = ICONS.find((i) => i.name === selectedIconName);
  const SelectedIcon = selectedIconObj ? selectedIconObj.icon : null;

  useEffect(() => { if (open) setStep(1); }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClose = () => {
    setStep(1); setChannelData(null); setName(""); setDescription("");
    setAdvancedOpen(false); setModeratorsOnly(true); setAllowAttachments(true);
    setAllowReactions(true); setAllowComments(true); setPickerOpen(false);
    setSelectedColor("#079455"); setSelectedIconName(""); onOpenChange(false);
  };

  const handleNextStep = () => {
    const icon = SelectedIcon ?? MessageCirclePlus;
    const data: ChannelFormData = { name, icon, color: selectedColor };
    setChannelData(data); setStep(2);
  };

  const handleCreateChannel = () => {
    if (channelData) { onCreateChannel?.(channelData); handleClose(); }
  };

  if (step === 2 && channelData) {
    return (
      <Modal open={open} onCancel={() => setStep(1)} footer={null} width="95vw" closeIcon={<X size={18} color="#717680" />} styles={{ body: { padding: 0, width: "100%", height: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 } }} className="add-members-modal" style={{ top: 24, maxWidth: 1400 }}>
        <AddMembersStep channelName={channelData.name || "novo canal"} onBack={() => setStep(1)} onCreate={handleCreateChannel} />
      </Modal>
    );
  }

  if (!open) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Overlay */}
      <div onClick={handleClose} style={{ position: "absolute", inset: 0, background: "rgba(52, 64, 84, 0.6)" }} />

      {/* Modal */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1, width: 620, background: "#fff", borderRadius: 16, boxShadow: "0 24px 80px rgba(10,13,18,0.22)", display: "flex", flexDirection: "column", border: "1px solid #E9EAEB", overflow: "hidden", maxHeight: "90vh" }}>

        {/* ── Header ── */}
        <Flex align="center" justify="space-between" style={{ padding: "20px 28px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
          <Flex align="center" gap={14}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: selectedColor + "20", transition: "background 0.25s ease" }}>
              {SelectedIcon
                ? <SelectedIcon size={20} style={{ color: selectedColor, transition: "color 0.25s ease" }} />
                : <MessageCirclePlus size={20} style={{ color: selectedColor, transition: "color 0.25s ease" }} />}
            </div>
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "26px" }}>
                Novo canal de comunicação
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#717680" }}>
                Adicione e gerencie os membros do canal.
              </Typography.Text>
            </div>
          </Flex>
          <button onClick={handleClose} style={closeBtnStyle}>
            <X size={18} color="#A4A7AE" />
          </button>
        </Flex>

        {/* ── Body ── */}
        <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }} className="thin-scrollbar">
          {/* Channel name */}
          <div style={{ marginBottom: 16 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
              <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}>Nome do canal</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>{name.length}/50 caracteres</Typography.Text>
            </Flex>
            <Input placeholder="Dê um nome para o canal" value={name} onChange={(e) => { if (e.target.value.length <= 50) setName(e.target.value); }} style={{ borderRadius: 8, height: 40 }} />
          </div>

          {/* Description editor */}
          <div style={{ border: "1px solid #D0D5DD", borderRadius: 12, overflow: "hidden", marginBottom: 16, display: "flex", flexDirection: "column" }}>
            <Flex align="center" justify="space-between" style={{ padding: "8px 12px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB", flexShrink: 0 }}>
              <Flex align="center" gap={2}>
                {[Undo2, Redo2].map((Icon, i) => <TBtn key={i} icon={Icon} />)}
                <Div />
                <button style={tbStyle}><span style={{ fontWeight: 700 }}>H1</span><span style={{ margin: "0 2px", color: "#D5D7DA" }}>·</span><span style={{ fontSize: 12 }}>Título 1</span><ChevronDown size={11} /></button>
                <Div />
                {[Bold, Image, AlignLeft, List].map((Icon, i) => <TBtnIcon key={i} icon={Icon} />)}
              </Flex>
              <button style={{ ...tbStyle, color: "#7A5AF8", fontWeight: 600 }}><Sparkles size={14} fill="#7A5AF8" />Criar com SIA</button>
            </Flex>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva sobre o que será discutido no canal, quais termos são proibidos, regras..." style={{ width: "100%", minHeight: 130, padding: "12px 14px", fontSize: 14, background: "#fff", border: "none", outline: "none", resize: "none", fontFamily: "inherit", color: "#181D27", lineHeight: "22px", boxSizing: "border-box", flex: 1 }} />
            {description.trim() && (
              <div style={{ padding: "8px 12px", background: "#fff", flexShrink: 0 }}>
                <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, border: "1px solid #B2DDFF", background: "#EFF8FF", color: "#1570EF", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}><Pen size={13} />Revisão</button>
              </div>
            )}
          </div>

          {/* Icon/colour picker trigger */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Flex align="center" gap={12}>
              <button ref={triggerRef} onClick={() => setPickerOpen((v) => !v)} style={{ width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #EAECF0", cursor: "pointer", flexShrink: 0, background: selectedIconName ? selectedColor + "15" : "#F9FAFB", transition: "background 0.2s, border-color 0.2s" }}>
                {selectedIconName && SelectedIcon ? <SelectedIcon size={20} style={{ color: selectedColor }} /> : <Plus size={18} style={{ color: "#98A2B3" }} />}
              </button>
              <div>
                <Typography.Text style={{ fontSize: 14, fontWeight: 500, color: "#181D27", display: "block", lineHeight: "20px" }}>Alterar ícone e cor do canal</Typography.Text>
                <Typography.Text style={{ fontSize: 13, color: "#667085" }}>Defina um ícone para representar seu grupo</Typography.Text>
              </div>
            </Flex>
          </div>

          <div style={{ height: 1, background: "#EAECF0", margin: "0 0 16px" }} />

          {/* Advanced options */}
          <div>
            <button onClick={() => setAdvancedOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#414651", padding: "2px 0", fontFamily: "inherit" }}>
              Opções avançadas {advancedOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {advancedOpen && (
              <Flex vertical gap={14} style={{ marginTop: 12 }}>
                <ToggleOpt label="Apenas moderadores podem postar neste canal" checked={moderatorsOnly} onChange={setModeratorsOnly} />
                <ToggleOpt label="Permitir anexar arquivos, vídeos, áudios e fotos" checked={allowAttachments} onChange={setAllowAttachments} />
                <ToggleOpt label="Permitir reações nas postagens" checked={allowReactions} onChange={setAllowReactions} />
                <ToggleOpt label="Permitir comentários nas postagens" checked={allowComments} onChange={setAllowComments} />
              </Flex>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <Flex align="center" justify="flex-end" gap={12} style={{ padding: "14px 28px", borderTop: "1px solid #E9EAEB", flexShrink: 0 }}>
          <button onClick={handleClose} style={secondaryBtnStyle}>Cancelar</button>
          <button onClick={handleNextStep} style={primaryBtnStyle}>
            Próximo <ArrowRight size={15} />
          </button>
        </Flex>
      </div>

      {/* Picker — floats to the left of the modal */}
      {pickerOpen && (
        <div
          ref={pickerRef}
          style={{
            position: "fixed",
            top: "50%",
            left: "calc(50% - 310px - 276px)",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <IconColorPicker selectedColor={selectedColor} selectedIconName={selectedIconName} onColorSelect={setSelectedColor} onIconSelect={(n) => { setSelectedIconName(n); setPickerOpen(false); }} />
        </div>
      )}
    </div>,
    document.body,
  );
};

/* ── Helpers ── */
const closeBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "none", border: "none", cursor: "pointer", borderRadius: 8, padding: 0 };
const secondaryBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "1px solid #D5D7DA", background: "#fff", fontSize: 14, fontWeight: 500, color: "#344054", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" };
const primaryBtnStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: "#1570EF", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" };
const tbStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 6, color: "#535862", fontSize: 12, fontFamily: "inherit" };
const TBtn = ({ icon: Icon }: { icon: React.ElementType }) => <button style={tbStyle}><Icon size={14} /></button>;
const TBtnIcon = ({ icon: Icon }: { icon: React.ElementType }) => <button style={tbStyle}><Icon size={14} /><ChevronDown size={10} /></button>;
const Div = () => <div style={{ width: 1, height: 16, background: "#E9EAEB", margin: "0 4px" }} />;
const ToggleOpt = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <Flex align="center" gap={10}>
    <Switch size="small" checked={checked} onChange={onChange} style={{ flexShrink: 0 }} />
    <Typography.Text style={{ fontSize: 13, color: "#414651" }}>{label}</Typography.Text>
  </Flex>
);

export default CreateChannelModal;
