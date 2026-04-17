import { useState, useCallback } from "react";
import { Avatar, Button, Checkbox, Drawer, Dropdown, Flex, Input, Select, Tag, Typography } from "antd";
import type { MenuProps } from "antd";
import { ArrowLeft, Check, MoreVertical, Plus, Search, UserPlus, Users, X } from "lucide-react";
import { avatar } from '@/lib/avatar';

/* ── Types ── */
interface Member {
  id: string;
  name: string;
  role: string;
  area: string;
  unit: string;
  avatar: string;
  moderation: string;
}

interface Collaborator {
  id: string;
  name: string;
  role: string;
  area: string;
  unit: string;
  avatar: string;
}

/* ── Static data ── */
const INITIAL_MEMBERS: Member[] = [
  { id: "1",  name: "Alice Johnson",  role: "Desenvolvedora Front-end", area: "Tecnologia", unit: "SP", avatar: avatar("Alice Johnson"),  moderation: "Membro" },
  { id: "2",  name: "Bob Williams",   role: "Gerente de Produto",        area: "Produto",    unit: "RJ", avatar: avatar("Bob Williams"),   moderation: "Moderador" },
  { id: "3",  name: "Carol Martinez", role: "Designer UX/UI",            area: "Design",     unit: "SP", avatar: avatar("Carol Martinez"), moderation: "Membro" },
  { id: "4",  name: "David Chen",     role: "Engenheiro de Dados",       area: "Tecnologia", unit: "BH", avatar: avatar("David Chen"),     moderation: "Membro" },
  { id: "5",  name: "Eva Rodriguez",  role: "Analista de Marketing",     area: "Marketing",  unit: "SP", avatar: avatar("Eva Rodriguez"),  moderation: "Membro" },
  { id: "6",  name: "Frank Wilson",   role: "Desenvolvedor Back-end",    area: "Tecnologia", unit: "RS", avatar: avatar("Frank Wilson"),   moderation: "Moderador" },
  { id: "7",  name: "Grace Lee",      role: "Analista Financeira",       area: "Financeiro", unit: "SP", avatar: avatar("Grace Lee"),      moderation: "Membro" },
  { id: "8",  name: "Henry Taylor",   role: "Especialista de Vendas",    area: "Vendas",     unit: "RJ", avatar: avatar("Henry Taylor"),   moderation: "Membro" },
];

const ALL_COLLABORATORS: Collaborator[] = [
  { id: "c1",  name: "Phoenix Baker",   role: "Desenvolvedor PHP",        area: "Desenvolvimento", unit: "SP", avatar: avatar("Phoenix Baker") },
  { id: "c2",  name: "Lana Steiner",    role: "Desenvolvedor PHP",        area: "Desenvolvimento", unit: "RJ", avatar: avatar("Lana Steiner") },
  { id: "c3",  name: "Candice Wu",      role: "Tech Lead",                area: "Desenvolvimento", unit: "SP", avatar: avatar("Candice Wu") },
  { id: "c4",  name: "Ethan Reyes",     role: "Engenheiro de Software",   area: "Desenvolvimento", unit: "BH", avatar: avatar("Ethan Reyes") },
  { id: "c5",  name: "Sofia Kim",       role: "Designer UX/UI",           area: "Design",          unit: "SP", avatar: avatar("Sofia Kim") },
  { id: "c6",  name: "Jaxon Lee",       role: "Gerente de Projetos",      area: "Gestão",          unit: "RS", avatar: avatar("Jaxon Lee") },
  { id: "c7",  name: "Maya Lopez",      role: "Analista de Dados",        area: "Análise",         unit: "SP", avatar: avatar("Maya Lopez") },
  { id: "c8",  name: "Oliver Chen",     role: "Desenvolvedor Front-end",  area: "Desenvolvimento", unit: "RJ", avatar: avatar("Oliver Chen") },
  { id: "c9",  name: "Ava Patel",       role: "Desenvolvedora Back-end",  area: "Desenvolvimento", unit: "SP", avatar: avatar("Ava Patel") },
  { id: "c10", name: "Lucas Martinez",  role: "Especialista em SEO",      area: "Marketing",       unit: "BH", avatar: avatar("Lucas Martinez") },
];

const MEMBER_DEPTS = ["Todos", "Tecnologia", "Produto", "Design", "Marketing", "Financeiro", "Vendas", "RH"];
const ADD_DEPTS    = ["Todos", "Desenvolvimento", "Design", "Marketing", "Gestão", "Análise", "Outros"];

/* ── Props ── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberCountChange?: (count: number) => void;
  onMembersAdded?: (name: string) => void;
  onMemberRemoved?: (name: string) => void;
}

/* ── Component ── */
const ChannelMembersPanel = ({ open, onOpenChange, onMemberCountChange, onMembersAdded, onMemberRemoved }: Props) => {
  /* members list state */
  const [search,  setSearch]  = useState("");
  const [dept,    setDept]    = useState("Todos");
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  /* add-members state */
  const [addSearch,  setAddSearch]  = useState("");
  const [addDept,    setAddDept]    = useState("Todos");
  const [selected,   setSelected]   = useState<string[]>([]);

  /* view: "list" → members, "add" → add collaborators */
  const [view, setView] = useState<"list" | "add">("list");

  /* ── Handlers: members list ── */
  const handleRemove = useCallback((member: Member) => {
    setMembers(prev => {
      const next = prev.filter(m => m.id !== member.id);
      onMemberCountChange?.(next.length);
      onMemberRemoved?.(member.name);
      return next;
    });
  }, [onMemberCountChange, onMemberRemoved]);

  const handleModChange = useCallback((id: string, mod: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, moderation: mod } : m));
  }, []);

  /* ── Handlers: add panel ── */
  const currentIds = members.map(m => m.id);

  const addVisible = ALL_COLLABORATORS.filter(c =>
    !currentIds.includes(c.id) &&
    (addDept === "Todos" || c.area === addDept) &&
    (c.name.toLowerCase().includes(addSearch.toLowerCase()) ||
     c.role.toLowerCase().includes(addSearch.toLowerCase()))
  );

  const toggleAll = () =>
    setSelected(prev => prev.length === addVisible.length ? [] : addVisible.map(c => c.id));

  const toggleOne = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleConfirmAdd = () => {
    const toAdd = ALL_COLLABORATORS.filter(c => selected.includes(c.id));
    const newMembers: Member[] = toAdd.map(c => ({
      id: c.id, name: c.name, role: c.role, area: c.area, unit: c.unit,
      avatar: c.avatar, moderation: "Membro",
    }));
    setMembers(prev => {
      const next = [...prev, ...newMembers];
      onMemberCountChange?.(next.length);
      return next;
    });
    toAdd.forEach(c => onMembersAdded?.(c.name));
    setSelected([]);
    setAddSearch("");
    setAddDept("Todos");
    setView("list");
  };

  const handleGoToAdd = () => {
    setSelected([]);
    setAddSearch("");
    setAddDept("Todos");
    setView("add");
  };

  const handleBackToList = () => setView("list");

  const handleClose = () => {
    onOpenChange(false);
    // reset add state on close
    setTimeout(() => {
      setView("list");
      setSelected([]);
      setAddSearch("");
      setAddDept("Todos");
    }, 300);
  };

  /* ── Filtered members ── */
  const filtered = members.filter(m =>
    (dept === "Todos" || m.area === dept) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.role.toLowerCase().includes(search.toLowerCase()))
  );

  /* ── Drawer title ── */
  const drawerTitle = view === "list" ? (
    <Flex align="center" gap={10}>
      <Typography.Title level={5} style={{ margin: 0 }}>Membros do canal</Typography.Title>
      <Tag style={{ borderRadius: 99, background: "#EFF8FF", border: "1px solid #B2DDFF", color: "#175CD3", fontWeight: 600 }}>
        {members.length}
      </Tag>
    </Flex>
  ) : (
    <Flex align="center" gap={10}>
      <button onClick={handleBackToList} style={backBtnStyle}>
        <ArrowLeft size={16} />
      </button>
      <Typography.Title level={5} style={{ margin: 0 }}>Adicionar membros</Typography.Title>
    </Flex>
  );

  /* ── Drawer footer ── */
  const drawerFooter = view === "list" ? (
    <Flex justify="flex-end" gap={12}>
      <Button onClick={handleClose}>Fechar</Button>
      <Button type="primary" icon={<UserPlus size={15} />} onClick={handleGoToAdd}>
        Adicionar membros
      </Button>
    </Flex>
  ) : (
    <Flex justify="space-between" align="center">
      <Typography.Text style={{ color: "#344054", fontWeight: 500 }}>
        {selected.length} colaborador{selected.length !== 1 && "es"} selecionado{selected.length !== 1 && "s"}
      </Typography.Text>
      <Flex gap={12}>
        <Button onClick={handleBackToList}>Cancelar</Button>
        <Button type="primary" disabled={selected.length === 0} onClick={handleConfirmAdd}>
          Adicionar ({selected.length})
        </Button>
      </Flex>
    </Flex>
  );

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement="right"
      width={540}
      closeIcon={<X size={18} />}
      title={drawerTitle}
      styles={{
        body:   { padding: 0, overflow: "hidden" },
        header: { padding: "16px 24px", borderBottom: "1px solid #E9EAEB" },
        footer: { padding: "16px 24px", borderTop: "1px solid #E9EAEB" },
      }}
      footer={drawerFooter}
    >
      {/* ── Sliding container ── */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
        <div style={{
          display: "flex",
          width: "200%",
          height: "100%",
          transform: view === "list" ? "translateX(0)" : "translateX(-50%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>

          {/* ── PANEL 1: Members list ── */}
          <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Search */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
              <Input
                prefix={<Search size={14} color="#A4A7AE" />}
                placeholder="Buscar membros..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Dept filters */}
            <div style={{ padding: "12px 24px", borderBottom: "1px solid #E9EAEB", overflowX: "auto", flexShrink: 0 }} className="filter-scrollbar">
              <Flex gap={8} style={{ minWidth: "max-content" }}>
                {MEMBER_DEPTS.map(d => (
                  <Tag.CheckableTag key={d} checked={dept === d} onChange={() => setDept(d)}
                    style={dept === d ? activeTagStyle : inactiveTagStyle}>
                    {d}
                  </Tag.CheckableTag>
                ))}
              </Flex>
            </div>

            {/* Member list */}
            <div style={{ overflowY: "auto", flex: 1 }} className="thin-scrollbar">
              {filtered.map(member => {
                const menuItems: MenuProps["items"] = [
                  {
                    key: "make-mod",
                    label: member.moderation === "Moderador" ? "Remover moderação" : "Tornar moderador",
                    onClick: () => handleModChange(member.id, member.moderation === "Moderador" ? "Membro" : "Moderador"),
                  },
                  { type: "divider" },
                  { key: "remove", label: "Remover do canal", danger: true, onClick: () => handleRemove(member) },
                ];
                return (
                  <Flex key={member.id} align="center" gap={12} style={{ padding: "12px 24px", borderBottom: "1px solid #F5F5F5" }}>
                    <Avatar src={member.avatar} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Flex align="center" gap={8} wrap="wrap">
                        <Typography.Text strong style={{ fontSize: 14, color: "#181D27" }}>{member.name}</Typography.Text>
                        <Tag style={{ borderRadius: 99, fontSize: 11, fontWeight: 500, background: member.moderation === "Moderador" ? "#EFF8FF" : "#F5F5F5", border: `1px solid ${member.moderation === "Moderador" ? "#B2DDFF" : "#E9EAEB"}`, color: member.moderation === "Moderador" ? "#175CD3" : "#535862", margin: 0 }}>
                          {member.moderation}
                        </Tag>
                      </Flex>
                      <Typography.Text type="secondary" style={{ fontSize: 12, display: "block" }}>{member.role}</Typography.Text>
                      <Flex gap={6} style={{ marginTop: 4 }}>
                        <Tag style={{ borderRadius: 99, fontSize: 11, color: "#535862", border: "1px solid #E9EAEB", background: "#fff", padding: "0 8px", margin: 0 }}>{member.area}</Tag>
                        <Tag style={{ borderRadius: 99, fontSize: 11, color: "#535862", border: "1px solid #E9EAEB", background: "#fff", padding: "0 8px", margin: 0 }}>{member.unit}</Tag>
                      </Flex>
                    </div>
                    <Flex align="center" gap={8}>
                      <Select
                        value={member.moderation}
                        onChange={v => handleModChange(member.id, v)}
                        size="small"
                        style={{ width: 130 }}
                        options={[
                          { value: "Membro",    label: "Membro" },
                          { value: "Moderador", label: "Moderador" },
                        ]}
                      />
                      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
                        <button style={ghostBtn}><MoreVertical size={16} /></button>
                      </Dropdown>
                    </Flex>
                  </Flex>
                );
              })}
              {filtered.length === 0 && (
                <Flex align="center" justify="center" style={{ padding: 40 }}>
                  <Typography.Text type="secondary">Nenhum membro encontrado</Typography.Text>
                </Flex>
              )}
            </div>
          </div>

          {/* ── PANEL 2: Add collaborators ── */}
          <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Search */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E9EAEB", flexShrink: 0 }}>
              <Input
                prefix={<Search size={14} color="#A4A7AE" />}
                placeholder="Pesquisar colaboradores..."
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
              />
            </div>

            {/* Dept filters */}
            <div style={{ padding: "12px 24px", borderBottom: "1px solid #E9EAEB", overflowX: "auto", flexShrink: 0 }} className="filter-scrollbar">
              <Flex gap={8} style={{ minWidth: "max-content" }}>
                {ADD_DEPTS.map(d => (
                  <Tag.CheckableTag key={d} checked={addDept === d} onChange={() => setAddDept(d)}
                    style={addDept === d ? activeTagStyle : inactiveTagStyle}>
                    {d}
                  </Tag.CheckableTag>
                ))}
              </Flex>
            </div>

            {/* List header */}
            <div style={{ padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
              <Flex align="center" gap={8}>
                <Users size={15} color="#475467" />
                <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>
                  Colaboradores fora do canal
                </Typography.Text>
              </Flex>
              <Checkbox
                checked={selected.length === addVisible.length && addVisible.length > 0}
                indeterminate={selected.length > 0 && selected.length < addVisible.length}
                onChange={toggleAll}
              >
                <Typography.Text style={{ fontSize: 13, color: "#344054" }}>Selecionar todos</Typography.Text>
              </Checkbox>
            </div>

            {/* Collaborator list */}
            <div style={{ overflowY: "auto", flex: 1 }} className="thin-scrollbar">
              {addVisible.map(c => {
                const isSelected = selected.includes(c.id);
                return (
                  <Flex
                    key={c.id} align="center" justify="space-between" gap={12}
                    style={{ padding: "12px 24px", borderBottom: "1px solid #F2F4F7", cursor: "pointer", transition: "background 0.1s" }}
                    onClick={() => toggleOne(c.id)}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <Flex align="center" gap={12}>
                      <Avatar src={c.avatar} size={38} />
                      <div>
                        <Typography.Text strong style={{ fontSize: 14, display: "block", color: "#101828" }}>{c.name}</Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 13, color: "#475467" }}>{c.role}, {c.area}</Typography.Text>
                      </div>
                    </Flex>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: isSelected ? "none" : "1px solid #D0D5DD",
                      background: isSelected ? "#1570EF" : "#fff",
                      transition: "all 0.18s",
                    }}>
                      {isSelected ? <Check size={16} color="#fff" strokeWidth={2.5} /> : <Plus size={16} color="#667085" />}
                    </div>
                  </Flex>
                );
              })}
              {addVisible.length === 0 && (
                <Flex align="center" justify="center" style={{ padding: 40 }}>
                  <Typography.Text type="secondary">Nenhum colaborador encontrado</Typography.Text>
                </Flex>
              )}
            </div>
          </div>

        </div>
      </div>
    </Drawer>
  );
};

/* ── Styles ── */
const ghostBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  padding: 4, borderRadius: 6, color: "#A4A7AE", display: "flex", alignItems: "center",
};
const backBtnStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  padding: "4px 6px", borderRadius: 6, color: "#667085",
  display: "flex", alignItems: "center",
};
const activeTagStyle: React.CSSProperties   = { borderRadius: 99, cursor: "pointer", fontWeight: 500, fontSize: 13, padding: "4px 12px", border: "1px solid #84CAFF", background: "#EFF8FF", color: "#175CD3" };
const inactiveTagStyle: React.CSSProperties = { borderRadius: 99, cursor: "pointer", fontWeight: 500, fontSize: 13, padding: "4px 12px", border: "1px solid #E9EAEB", background: "#fff",    color: "#535862" };

export default ChannelMembersPanel;
