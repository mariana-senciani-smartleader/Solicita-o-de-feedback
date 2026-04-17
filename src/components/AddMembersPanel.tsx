import { useState } from "react";
import { Avatar, Button, Checkbox, Drawer, Flex, Input, Tag, Typography } from "antd";
import { Search, Plus, Check, X, Users } from "lucide-react";
import { avatar } from '@/lib/avatar';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  area: string;
  unit: string;
  avatar: string;
}

const ALL_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "Phoenix Baker", role: "Desenvolvedor PHP", area: "Desenvolvimento", unit: "SP", avatar: avatar("Phoenix Baker") },
  { id: "2", name: "Lana Steiner", role: "Desenvolvedor PHP", area: "Desenvolvimento", unit: "RJ", avatar: avatar("Lana Steiner") },
  { id: "3", name: "Candice Wu", role: "Tech Lead", area: "Desenvolvimento", unit: "SP", avatar: avatar("Candice Wu") },
  { id: "4", name: "Ethan Reyes", role: "Engenheiro de Software", area: "Desenvolvimento", unit: "BH", avatar: avatar("Ethan Reyes") },
  { id: "5", name: "Sofia Kim", role: "Designer UX/UI", area: "Design", unit: "SP", avatar: avatar("Sofia Kim") },
  { id: "6", name: "Jaxon Lee", role: "Gerente de Projetos", area: "Gestão", unit: "RS", avatar: avatar("Jaxon Lee") },
  { id: "7", name: "Maya Lopez", role: "Analista de Dados", area: "Análise", unit: "SP", avatar: avatar("Maya Lopez") },
  { id: "8", name: "Oliver Chen", role: "Desenvolvedor Front-end", area: "Desenvolvimento", unit: "RJ", avatar: avatar("Oliver Chen") },
  { id: "9", name: "Ava Patel", role: "Desenvolvedora Back-end", area: "Desenvolvimento", unit: "SP", avatar: avatar("Ava Patel") },
  { id: "10", name: "Lucas Martinez", role: "Especialista em SEO", area: "Marketing", unit: "BH", avatar: avatar("Lucas Martinez") },
];

const DEPARTMENTS = ["Todos", "Desenvolvimento", "Recursos Humanos", "Design", "Marketing", "Jurídico", "Outros"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMembers?: string[];
  onAddMembers?: (members: Collaborator[]) => void;
}

const AddMembersPanel = ({ open, onOpenChange, currentMembers = [], onAddMembers }: Props) => {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Todos");
  const [selected, setSelected] = useState<string[]>([]);

  const visible = ALL_COLLABORATORS.filter(
    (c) =>
      !currentMembers.includes(c.id) &&
      (dept === "Todos" || c.area === dept) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleAll = () =>
    setSelected((prev) => (prev.length === visible.length ? [] : visible.map((c) => c.id)));

  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleAdd = () => {
    const membersToAdd = ALL_COLLABORATORS.filter((c) => selected.includes(c.id));
    onAddMembers?.(membersToAdd);
    onOpenChange(false);
    setSelected([]);
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      placement="right"
      width={600}
      style={{ borderRadius: 0 }}
      closable={false}
      title={
        <Flex align="flex-start" justify="space-between" style={{ width: "100%" }}>
          <div>
            <Typography.Title level={5} style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: "24px" }}>Adicionar membros</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>Pesquise e selecione os membros que deseja adicionar ao canal</Typography.Text>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "#667085", width: 24, height: 24, flexShrink: 0 }}
          >
            <X size={20} />
          </button>
        </Flex>
      }
      styles={{ body: { padding: 0 }, header: { padding: "24px 32px", borderBottom: "1px solid #EAECF0" }, footer: { padding: "16px 32px" } }}
      footer={
        <Flex justify="space-between" align="center">
          <Typography.Text style={{ color: "#344054", fontWeight: 500 }}>
            {selected.length} colaborador{selected.length !== 1 && "es"} selecionado{selected.length !== 1 && "s"}
          </Typography.Text>
          <Flex gap={12}>
            <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="primary" disabled={selected.length === 0} onClick={handleAdd}>
              Adicionar ({selected.length})
            </Button>
          </Flex>
        </Flex>
      }
    >
      {/* Search */}
      <div style={{ padding: "16px 32px" }}>
        <Input
          prefix={<Search size={20} color="#667085" />}
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: 8, padding: "10px 14px" }}
        />
      </div>

      {/* Dept filters */}
      <div style={{ padding: "0 32px 16px", borderBottom: "1px solid #EAECF0", overflowX: "auto" }} className="filter-scrollbar">
        <Flex gap={8} style={{ minWidth: "max-content" }}>
          {DEPARTMENTS.map((d) => (
            <Tag.CheckableTag key={d} checked={dept === d} onChange={() => setDept(d)}
              style={dept === d ? activeTagStyle : inactiveTagStyle}>
              {d}
            </Tag.CheckableTag>
          ))}
        </Flex>
      </div>

      {/* List Header */}
      <div style={{ padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Flex align="center" gap={8}>
          <Users size={16} color="#475467" />
          <Typography.Text strong style={{ fontSize: 14, color: "#101828" }}>Colaboradores fora do canal</Typography.Text>
        </Flex>
        <Checkbox
          checked={selected.length === visible.length && visible.length > 0}
          indeterminate={selected.length > 0 && selected.length < visible.length}
          onChange={toggleAll}
        >
          <Typography.Text style={{ fontSize: 14, color: "#344054" }}>Selecionar todos</Typography.Text>
        </Checkbox>
      </div>

      {/* Collaborator list */}
      <div style={{ overflowY: "auto", flex: 1 }} className="thin-scrollbar">
        {visible.map((c) => {
          const isSelected = selected.includes(c.id);
          return (
            <Flex
              key={c.id} align="center" justify="space-between" gap={12}
              style={{ padding: "12px 32px", borderBottom: "1px solid #F2F4F7", cursor: "pointer", transition: "background 0.1s" }}
              onClick={() => toggleOne(c.id)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <Flex align="center" gap={12}>
                <Avatar src={c.avatar} size={40} />
                <div>
                  <Typography.Text strong style={{ fontSize: 14, display: "block", color: "#101828" }}>{c.name}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 14, color: "#475467" }}>{c.role}, {c.area}</Typography.Text>
                </div>
              </Flex>

              <div style={{
                width: 36, height: 36, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: isSelected ? "none" : "1px solid #D0D5DD",
                background: isSelected ? "#1570EF" : "white",
                transition: "all 0.2s"
              }}>
                {isSelected ? <Check size={20} color="white" /> : <Plus size={20} color="#667085" />}
              </div>
            </Flex>
          );
        })}
        {visible.length === 0 && (
          <Flex align="center" justify="center" style={{ padding: 40 }}>
            <Typography.Text type="secondary">Nenhum colaborador encontrado</Typography.Text>
          </Flex>
        )}
      </div>
    </Drawer>
  );
};

const activeTagStyle: React.CSSProperties = { borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14, padding: "6px 12px", border: "none", background: "#EFF8FF", color: "#175CD3" };
const inactiveTagStyle: React.CSSProperties = { borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 14, padding: "6px 12px", border: "1px solid #EAECF0", background: "#fff", color: "#344054" };

export default AddMembersPanel;
