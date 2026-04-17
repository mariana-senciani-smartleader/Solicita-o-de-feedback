import { useState, useRef, useEffect } from "react";
import { Button, Flex, Input, Modal, Switch, Typography } from "antd";
import {
  AlignLeft, ArrowRight, Bell, Bold, BookOpen, Briefcase,
  Camera, Check, ChevronDown, ChevronRight, Code2, Coffee,
  Gift, Globe, Hash, Headphones, Heart, Image, List,
  Megaphone, MessageCirclePlus, Music, Pen, Plus, Redo2, Rocket, Scale,
  Search, Shield, Sparkles, Star, Target, Undo2, X, Zap,
  Banknote,
} from "lucide-react";

interface EditChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName?: string;
  channelIcon?: React.ElementType;
  channelColor?: string;
  onSave?: (data: { name: string; icon: React.ElementType; color: string }) => void;
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
  selectedColor,
  selectedIconName,
  onColorSelect,
  onIconSelect,
}: {
  selectedColor: string;
  selectedIconName: string;
  onColorSelect: (c: string) => void;
  onIconSelect: (n: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = ICONS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      style={{
        width: 260,
        background: "#fff",
        border: "1px solid #E9EAEB",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(10,13,18,0.12)",
        overflow: "hidden",
      }}
    >
      {/* Colour swatches */}
      <div style={{ padding: 12, borderBottom: "1px solid #E9EAEB" }}>
        <Flex wrap="wrap" gap={6}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: color,
                border: selectedColor === color ? "2px solid #fff" : "none",
                boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {selectedColor === color && <Check size={11} color="#fff" strokeWidth={3} />}
            </button>
          ))}
        </Flex>
      </div>

      {/* Search */}
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #E9EAEB" }}>
        <Flex
          align="center"
          gap={8}
          style={{ background: "#F5F5F5", borderRadius: 8, padding: "6px 10px" }}
        >
          <Search size={13} color="#A4A7AE" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar ícone"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#181D27",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </Flex>
      </div>

      {/* Icon list */}
      <div style={{ maxHeight: 220, overflowY: "auto" }} className="thin-scrollbar">
        {filtered.length === 0 && (
          <div style={{ padding: "16px 12px", textAlign: "center", color: "#A4A7AE", fontSize: 13 }}>
            Nenhum ícone encontrado
          </div>
        )}
        {filtered.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => onIconSelect(name)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              background: selectedIconName === name ? "#F5F5F5" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              fontSize: 14,
              color: "#414651",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              if (selectedIconName !== name) e.currentTarget.style.background = "#FAFAFA";
            }}
            onMouseLeave={(e) => {
              if (selectedIconName !== name) e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: selectedColor + "20",
                flexShrink: 0,
              }}
            >
              <Icon size={15} style={{ color: selectedColor }} />
            </div>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

const EditChannelModal = ({ open, onOpenChange, channelName = "", channelIcon, channelColor = "#079455", onSave }: EditChannelModalProps) => {
  const [name, setName] = useState(channelName);
  const [description, setDescription] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [moderatorsOnly, setModeratorsOnly] = useState(true);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(channelColor);
  const [selectedIconName, setSelectedIconName] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Initialize state when modal opens or props change
  useEffect(() => {
    if (open) {
      setName(channelName);
      setSelectedColor(channelColor);
      if (channelIcon) {
        const found = ICONS.find(i => i.icon === channelIcon);
        if (found) setSelectedIconName(found.name);
      }
    }
  }, [open, channelName, channelIcon, channelColor]);

  const selectedIconObj = ICONS.find((i) => i.name === selectedIconName);
  const SelectedIcon = selectedIconObj ? selectedIconObj.icon : (channelIcon || MessageCirclePlus);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSave = () => {
    onSave?.({ name, icon: SelectedIcon, color: selectedColor });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      width={680}
      closeIcon={<X size={18} color="#717680" />}
      styles={{ body: { padding: 0 } }}
      style={{ top: 40 }}
    >
      {/* ── Header ── */}
      <Flex align="center" gap={16} style={{ padding: "24px 24px 0" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: selectedColor + "20",
            transition: "background 0.25s ease",
          }}
        >
          <SelectedIcon
            size={24}
            style={{ color: selectedColor, transition: "color 0.25s ease" }}
          />
        </div>
        <div>
          <Typography.Title level={5} style={{ margin: 0, fontWeight: 600, color: "#181D27" }}>
            Editar canal
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Atualize as informações do canal.
          </Typography.Text>
        </div>
      </Flex>

      {/* ── Form body ── */}
      <div
        style={{
          padding: "20px 24px 8px",
          overflowY: "auto",
          maxHeight: "calc(90vh - 200px)",
        }}
        className="thin-scrollbar"
      >
        {/* Channel name */}
        <div style={{ marginBottom: 16 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
            <Typography.Text
              style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}
            >
              Nome do canal
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {name.length}/50 caracteres
            </Typography.Text>
          </Flex>
          <Input
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= 50) setName(e.target.value);
            }}
            style={{ borderRadius: 8 }}
          />
        </div>

        {/* Description / rules editor */}
        <div
          style={{
            border: "1px solid #E9EAEB",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Toolbar */}
          <Flex
            align="center"
            justify="space-between"
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #E9EAEB",
              background: "#FAFAFA",
              flexShrink: 0,
            }}
          >
            <Flex align="center" gap={2}>
              {[Undo2, Redo2].map((Icon, i) => (
                <TBtn key={i} icon={Icon} />
              ))}
              <Div />
              <button style={tbStyle}>
                <span style={{ fontWeight: 700 }}>H1</span>
                <span style={{ margin: "0 2px", color: "#D5D7DA" }}>·</span>
                <span style={{ fontSize: 12 }}>Título 1</span>
                <ChevronDown size={11} />
              </button>
              <Div />
              {[Bold, Image, AlignLeft, List].map((Icon, i) => (
                <TBtnIcon key={i} icon={Icon} />
              ))}
            </Flex>
            <button style={{ ...tbStyle, color: "#7A5AF8", fontWeight: 600 }}>
              <Sparkles size={14} fill="#7A5AF8" />
              SIA
            </button>
          </Flex>

          {/* Textarea */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva sobre o que será discutido no canal, quais termos são proibidos, regras..."
            style={{
              width: "100%",
              minHeight: 90,
              padding: "12px 16px",
              fontSize: 14,
              background: "#fff",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              color: "#181D27",
              boxSizing: "border-box",
              flex: 1,
            }}
          />

          {/* Revisão button row */}
          <div style={{ padding: "8px 12px", background: "#fff", flexShrink: 0 }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid #B2DDFF",
                background: "#EFF8FF",
                color: "#1570EF",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Pen size={12} />
              Revisão
            </button>
          </div>
        </div>

        {/* ── Icon / colour picker trigger ── */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Flex align="center" gap={12} style={{ padding: "4px 0" }}>
            <button
              ref={triggerRef}
              onClick={() => setPickerOpen((v) => !v)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E9EAEB",
                cursor: "pointer",
                flexShrink: 0,
                background: selectedColor + "20",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <SelectedIcon size={17} style={{ color: selectedColor }} />
            </button>
            <div>
              <Typography.Text
                style={{ fontSize: 14, fontWeight: 500, color: "#181D27", display: "block" }}
              >
                Alterar ícone e cor do canal
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Defina um ícone para representar seu grupo
              </Typography.Text>
            </div>
          </Flex>

          {/* Picker dropdown */}
          {pickerOpen && (
            <div
              ref={pickerRef}
              style={{
                position: "absolute",
                left: 0,
                top: 54,
                zIndex: 1000,
                animation: "fadeIn 0.15s ease",
              }}
            >
              <IconColorPicker
                selectedColor={selectedColor}
                selectedIconName={selectedIconName}
                onColorSelect={setSelectedColor}
                onIconSelect={(n) => {
                  setSelectedIconName(n);
                  setPickerOpen(false);
                }}
              />
            </div>
          )}
        </div>

        <div style={{ height: 1, background: "#E9EAEB", margin: "0 0 16px" }} />

        {/* ── Advanced options ── */}
        <div style={{ marginBottom: 8 }}>
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              color: "#414651",
              padding: "4px 0",
              fontFamily: "inherit",
            }}
          >
            Opções avançadas{" "}
            {advancedOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {advancedOpen && (
            <Flex vertical gap={16} style={{ marginTop: 12 }}>
              <ToggleOpt
                label="Apenas moderadores podem postar neste canal"
                checked={moderatorsOnly}
                onChange={setModeratorsOnly}
              />
              <ToggleOpt
                label="Permitir anexar arquivos, vídeos, áudios e fotos"
                checked={allowAttachments}
                onChange={setAllowAttachments}
              />
              <ToggleOpt
                label="Permitir reações nas postagens"
                checked={allowReactions}
                onChange={setAllowReactions}
              />
              <ToggleOpt
                label="Permitir comentários nas postagens"
                checked={allowComments}
                onChange={setAllowComments}
              />
            </Flex>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <Flex
        justify="flex-end"
        gap={12}
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #E9EAEB",
          background: "#FAFAFA",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button
          type="primary"
          onClick={handleSave}
        >
          Salvar alterações
        </Button>
      </Flex>
    </Modal>
  );
};

/* ── Helpers ── */
const tbStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 6, color: "#535862", fontSize: 12, fontFamily: "inherit" };
const TBtn = ({ icon: Icon }: { icon: React.ElementType }) => <button style={tbStyle}><Icon size={14} /></button>;
const TBtnIcon = ({ icon: Icon }: { icon: React.ElementType }) => <button style={tbStyle}><Icon size={14} /><ChevronDown size={10} /></button>;
const Div = () => <div style={{ width: 1, height: 16, background: "#E9EAEB", margin: "0 4px" }} />;
const ToggleOpt = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <Flex align="center" gap={12}>
    <Switch checked={checked} onChange={onChange} style={{ flexShrink: 0 }} />
    <Typography.Text style={{ fontSize: 14, color: "#414651" }}>{label}</Typography.Text>
  </Flex>
);

export default EditChannelModal;