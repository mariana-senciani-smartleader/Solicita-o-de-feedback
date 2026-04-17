import { useState, useCallback } from "react";
import { Avatar, Button, Drawer, Flex, Input, Select, Typography } from "antd";
import { Search, UserPlus, Users, X } from "lucide-react";
import DeleteModal from "./DeleteModal";
import AddMembersToChannelModal from "./AddMembersToChannelModal";
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
  { id: "m1",  name: "Bruno Delorence",      role: "Product Design Lead",      area: "Design",         unit: "SP", avatar: avatar("Bruno Delorence"),      moderation: "Moderador" },
  { id: "m2",  name: "Olívia Rhye",           role: "Tech Lead",                area: "Desenvolvimento", unit: "RJ", avatar: avatar("Olívia Rhye"),   moderation: "Moderador" },
  { id: "m3",  name: "Drew Cano",             role: "Product Lead",             area: "Produto",         unit: "SP", avatar: avatar("Drew Cano"),      moderation: "Moderador" },
  { id: "m4",  name: "Phoenix Baker",         role: "UX Designer",              area: "Design",          unit: "SP", avatar: avatar("Phoenix Baker"),   moderation: "Membro" },
  { id: "m5",  name: "Ana Silva",             role: "UX Designer",              area: "Design",          unit: "BH", avatar: avatar("Ana Silva"),       moderation: "Membro" },
  { id: "m6",  name: "Rafael Costa",          role: "Engenheiro de Software",   area: "Desenvolvimento", unit: "SP", avatar: avatar("Rafael Costa"),    moderation: "Membro" },
  { id: "m7",  name: "Beatriz Rocha",         role: "Analista de Dados",        area: "Dados",           unit: "RS", avatar: avatar("Beatriz Rocha"),   moderation: "Membro" },
  { id: "m8",  name: "Lucas Martins",         role: "Especialista em Marketing",area: "Marketing",       unit: "SP", avatar: avatar("Lucas Martins"),   moderation: "Membro" },
  { id: "m9",  name: "Camila Fernandes",      role: "Gerente de Projetos",      area: "Gestão",          unit: "RJ", avatar: avatar("Camila Fernandes"),moderation: "Membro" },
  { id: "m10", name: "Felipe Souza",          role: "Desenvolvedor Front-end",  area: "Desenvolvimento", unit: "SP", avatar: avatar("Felipe Souza"),    moderation: "Membro" },
  { id: "m11", name: "Mariana Alves",         role: "Engenheira de Qualidade",  area: "QA",              unit: "BH", avatar: avatar("Mariana Alves"),   moderation: "Membro" },
  { id: "m12", name: "Pedro Lima",            role: "Especialista em Vendas",   area: "Comercial",       unit: "SP", avatar: avatar("Pedro Lima"),      moderation: "Membro" },
  { id: "m13", name: "Juliana Pereira",       role: "Designer Gráfico",         area: "Design",          unit: "RJ", avatar: avatar("Juliana Pereira"), moderation: "Membro" },
  { id: "m14", name: "Thiago Gomes",          role: "Consultor de Negócios",    area: "Produto",         unit: "SP", avatar: avatar("Thiago Gomes"),    moderation: "Membro" },
  { id: "m15", name: "Angela Moreira Salles", role: "Analista de RH",           area: "RH",              unit: "SP", avatar: avatar("Angela Moreira Salles"), moderation: "Membro" },
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

const ADD_DEPTS = ["Todos", "Desenvolvimento", "Design", "Marketing", "Gestão", "Análise", "Outros"];

/* ── Props ── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberCountChange?: (count: number) => void;
  onMembersAdded?: (name: string) => void;
  onMemberRemoved?: (name: string) => void;
}

/* ── Toast notification ── */
const Toast = ({ visible, title, message, onClose }: { visible: boolean; title: string; message: string; onClose: () => void }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", top: 16, right: 16, left: 16, zIndex: 1000,
      background: "#fff", borderRadius: 12,
      boxShadow: "0 4px 6px -2px rgba(16,24,40,0.03), 0 12px 16px -4px rgba(16,24,40,0.08)",
      padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12,
      border: "1px solid #EAECF0",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18, background: "#D1FADF",
        border: "4px solid #ECFDF3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="#039855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography.Text strong style={{ fontSize: 13, color: "#101828", display: "block", marginBottom: 2 }}>{title}</Typography.Text>
        <Typography.Text style={{ fontSize: 13, color: "#475467" }}>{message}</Typography.Text>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#98A2B3", flexShrink: 0 }}>
        <X size={16} />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
const ChannelMembersModal = ({ open, onOpenChange, onMemberCountChange, onMembersAdded, onMemberRemoved }: Props) => {
  /* ── add members modal ── */
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  /* ── members list state ── */
  const [search,             setSearch]             = useState("");
  const [members,            setMembers]            = useState<Member[]>(INITIAL_MEMBERS);
  const [notification,       setNotification]       = useState({ visible: false, title: "", message: "" });
  const [deleteOverlayVisible, setDeleteOverlayVisible] = useState(false);
  const [memberToDelete,     setMemberToDelete]     = useState<Member | null>(null);

  /* ── add-members state (kept for compatibility) ── */
  const [addSearch,  setAddSearch]  = useState("");
  const [addDept,    setAddDept]    = useState("Todos");
  const [selected,   setSelected]   = useState<string[]>([]);

  /* ── helpers ── */
  const showToast = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
    setTimeout(() => setNotification(p => ({ ...p, visible: false })), 4000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setView("list");
      setSelected([]);
      setAddSearch("");
      setAddDept("Todos");
    }, 300);
  };

  /* ── members list handlers ── */
  const confirmRemove = (member: Member) => { setMemberToDelete(member); setDeleteOverlayVisible(true); };

  const handleRemove = useCallback(() => {
    if (!memberToDelete) return;
    const name = memberToDelete.name;
    setMembers(prev => {
      const next = prev.filter(m => m.id !== memberToDelete.id);
      onMemberCountChange?.(next.length);
      onMemberRemoved?.(name);
      return next;
    });
    showToast("Membro excluído com sucesso", `${name} foi excluído com sucesso.`);
    setDeleteOverlayVisible(false);
    setMemberToDelete(null);
  }, [memberToDelete, onMemberCountChange, onMemberRemoved]);

  const handleModChange = useCallback((id: string, mod: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, moderation: mod } : m));
  }, []);

  /* ── add-members handlers ── */
  const currentIds = members.map(m => m.id);

  const addVisible = ALL_COLLABORATORS.filter(c =>
    !currentIds.includes(c.id) &&
    (addDept === "Todos" || c.area === addDept) &&
    (c.name.toLowerCase().includes(addSearch.toLowerCase()) || c.role.toLowerCase().includes(addSearch.toLowerCase()))
  );

  const toggleAll = () =>
    setSelected(prev => prev.length === addVisible.length ? [] : addVisible.map(c => c.id));

  const toggleOne = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleConfirmAdd = useCallback((ids: string[], _roles: Record<string, string>) => {
    // ALL_COLLABORATORS from AddMembersToChannelModal — re-use same data shape
    const toAdd = ids.map(id => {
      // Try to find in ALL_COLLABORATORS by id
      const found = ALL_COLLABORATORS.find(c => c.id === id);
      return found ?? null;
    }).filter(Boolean) as Collaborator[];
    setMembers(prev => {
      const existingIds = prev.map(m => m.id);
      const newOnes = toAdd.filter(c => !existingIds.includes(c.id));
      const next = [...prev, ...newOnes.map(c => ({ ...c, moderation: "Membro" as const }))];
      onMemberCountChange?.(next.length);
      return next;
    });
    toAdd.forEach(c => onMembersAdded?.(c.name));
    if (toAdd.length > 0) {
      const names = toAdd.map(c => c.name).join(", ");
      const msg = toAdd.length === 1 ? `${names} foi incluído no canal.` : `${names} foram incluídos no canal.`;
      showToast("Usuário adicionado com sucesso", msg);
    }
  }, [onMemberCountChange, onMembersAdded]);

  const handleGoToAdd = () => setAddMembersOpen(true);

  /* ── derived ── */
  const filtered     = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()));
  const filteredMods = filtered.filter(m => m.moderation === "Moderador");
  const filteredReg  = filtered.filter(m => m.moderation !== "Moderador");
  const sorted       = [...filteredMods, ...filteredReg];
  const lastModIdx   = filteredMods.length - 1;
  const modCount     = members.filter(m => m.moderation === "Moderador").length;
  const memberCount  = members.filter(m => m.moderation !== "Moderador").length;

  return (
    <>
      <Drawer
        open={open}
        onClose={handleClose}
        placement="right"
        width={640}
        closable={false}
        styles={{
          wrapper: {
            position: "fixed",
            top: 24, right: 24, bottom: 24,
            height: "calc(100vh - 48px)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          },
          body: { padding: 0, position: "relative", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" },
          header: { display: "none" },
        }}
        style={{ borderRadius: 16 }}
      >
        {/* Toast */}
        <Toast
          visible={notification.visible}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(p => ({ ...p, visible: false }))}
        />

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #EAECF0", flexShrink: 0 }}>
          <Flex align="flex-start" justify="space-between">
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828", display: "block", lineHeight: "24px" }}>
                Membros do canal
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#717680" }}>
                Gerencie os membros do canal
              </Typography.Text>
            </div>
            <button onClick={handleClose} style={closeBtn}>
              <X size={20} />
            </button>
          </Flex>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }} className="thin-scrollbar">

          {/* Summary card */}
          <Flex align="center" justify="space-between" style={{ padding: "14px 16px", border: "1px solid #EAECF0", borderRadius: 12, marginBottom: 20 }}>
            <Flex align="center" gap={12}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "#EFF8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={20} color="#1570EF" />
              </div>
              <div>
                <Typography.Text strong style={{ fontSize: 15, color: "#101828", display: "block" }}>
                  {members.length} membros
                </Typography.Text>
                <Typography.Text style={{ fontSize: 13, color: "#475467" }}>
                  {modCount} moderadores • {memberCount} membros
                </Typography.Text>
              </div>
            </Flex>
            <Button icon={<UserPlus size={15} />} onClick={handleGoToAdd}
              style={{ height: 38, borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
              Adicionar membros
            </Button>
          </Flex>

          {/* Search */}
          <Input
            prefix={<Search size={16} color="#667085" />}
            placeholder="Pesquisar membros..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ borderRadius: 8, marginBottom: 4 }}
          />

          {/* Member list */}
          <div>
            {sorted.map((member, i) => (
              <div key={member.id}>
                <Flex align="center" gap={12} style={{ padding: "12px 0" }}>
                  <Avatar src={member.avatar} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text strong style={{ fontSize: 14, color: "#101828", display: "block" }}>{member.name}</Typography.Text>
                    <Typography.Text style={{ fontSize: 13, color: "#475467" }}>{member.role}, {member.area}</Typography.Text>
                  </div>
                  <Flex align="center" gap={8}>
                    <Select
                      value={member.moderation}
                      onChange={v => handleModChange(member.id, v)}
                      size="middle"
                      style={{ width: 128 }}
                      options={[{ value: "Membro", label: "Membro" }, { value: "Moderador", label: "Moderador" }]}
                    />
                    <Button type="text" danger icon={<X size={16} />} onClick={() => confirmRemove(member)}
                      style={{ color: "#F04438", background: "#FEF3F2", border: "1px solid #FECDCA" }} />
                  </Flex>
                </Flex>
                {i === lastModIdx && filteredReg.length > 0 && (
                  <div style={{ borderTop: "1px solid #E9EAEB", margin: "4px 0" }} />
                )}
              </div>
            ))}
            {sorted.length === 0 && (
              <Typography.Text type="secondary" style={{ display: "block", textAlign: "center", padding: "32px 0" }}>
                Nenhum membro encontrado
              </Typography.Text>
            )}
          </div>
        </div>
      </Drawer>

      <AddMembersToChannelModal
        open={addMembersOpen}
        onOpenChange={setAddMembersOpen}
        onConfirmAdd={handleConfirmAdd}
      />

      <DeleteModal
        open={deleteOverlayVisible}
        title="Remover membro do canal"
        description={`Deseja remover ${memberToDelete?.name} do canal?`}
        confirmLabel="Delete"
        onCancel={() => setDeleteOverlayVisible(false)}
        onConfirm={handleRemove}
      />
    </>
  );
};

/* ── Styles ── */
const closeBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 4, color: "#667085", display: "flex", alignItems: "center", borderRadius: 6 };
const backBtn:  React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: "4px 8px", color: "#667085", display: "flex", alignItems: "center", borderRadius: 6 };
const activeTag:   React.CSSProperties = { borderRadius: 99, cursor: "pointer", fontWeight: 500, fontSize: 13, padding: "4px 12px", border: "1px solid #84CAFF", background: "#EFF8FF", color: "#175CD3" };
const inactiveTag: React.CSSProperties = { borderRadius: 99, cursor: "pointer", fontWeight: 500, fontSize: 13, padding: "4px 12px", border: "1px solid #E9EAEB", background: "#fff",    color: "#535862" };

export default ChannelMembersModal;
