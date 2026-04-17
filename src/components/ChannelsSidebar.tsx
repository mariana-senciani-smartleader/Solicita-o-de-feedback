import { useState, useEffect, useRef } from "react";
import { App, Card, Dropdown, Flex, Tooltip, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  BarChart3, Briefcase, CheckCircle2, ChevronDown, Code,
  Database, Globe, Headphones, Megaphone, Monitor, Package,
  Pencil, PiggyBank, Pin, Plus, Scale,
  Search, Sparkles, Trash2, Users2, Wrench, X, Check,
} from "lucide-react";
import CreateChannelModal from "./CreateChannelModal";
import EditChannelModal from "./EditChannelModal";
import DeleteModal from "./DeleteModal";
import type { ChannelInfo } from "./MainContent";

interface Channel {
  icon: React.ElementType;
  label: string;
  badge?: number;
  pinned?: boolean;
  iconBg: string;
  iconColorHex?: string;
  lastNotificationAt?: number;
}

interface ChannelsSidebarProps {
  selectedChannel: string;
  onSelectChannel: (ch: ChannelInfo) => void;
  style?: React.CSSProperties;
}

const fixedChannels: Channel[] = [
  { icon: Globe,    label: "Geral",           iconBg: "#1570EF" },
  { icon: Sparkles, label: "Aniversariantes", badge: 2, iconBg: "#7A5AF8" },
];

const otherChannelsDef: Channel[] = [
  { icon: Briefcase,  label: "Comercial",        iconBg: "#16B364", badge: 5 },
  { icon: Code,       label: "Desenvolvimento",  iconBg: "#3CCB7F", badge: 12 },
  { icon: Database,   label: "Data & BI",        iconBg: "#6172F3" },
  { icon: PiggyBank,  label: "Financeiro",       iconBg: "#0BA5EC", badge: 3 },
  { icon: Headphones, label: "Customer Success", iconBg: "#FAC515", badge: 8 },
  { icon: Scale,      label: "Jurídico",         iconBg: "#FF4405" },
  { icon: BarChart3,  label: "Marketing",        iconBg: "#D444F1", badge: 1 },
  { icon: Monitor,    label: "Tecnologia",       iconBg: "#099250" },
  { icon: Megaphone,  label: "Comunicação",      iconBg: "#F04438", badge: 4 },
  { icon: Wrench,     label: "Operações",        iconBg: "#EF6820" },
  { icon: Package,    label: "Produtos",         iconBg: "#875BF7", badge: 7 },
  { icon: Users2,     label: "RH",               iconBg: "#06AED4", badge: 2 },
];

const sortChannels = (channels: Channel[]) => {
  return [...channels].sort((a, b) => {
    // 1. Priority: Pinned channels
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

    // 2. Secondary: Within the same group (pinned or not), priority to badges
    const aHasBadge = (a.badge || 0) > 0;
    const bHasBadge = (b.badge || 0) > 0;
    if (aHasBadge !== bHasBadge) return aHasBadge ? -1 : 1;

    // 3. Tertiary: Last notification time
    const aTime = a.lastNotificationAt || 0;
    const bTime = b.lastNotificationAt || 0;
    if (aTime !== bTime) return bTime - aTime;

    // 4. Fallback: Alphabetical
    return a.label.localeCompare(b.label);
  });
};

const ChannelsSidebar = ({ selectedChannel, onSelectChannel, style }: ChannelsSidebarProps) => {
  const { notification } = App.useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [deletingChannel, setDeletingChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>(() => sortChannels(otherChannelsDef));
  const [segmentedOpen, setSegmentedOpen] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  const allChannels: Channel[] = [...fixedChannels, ...channels];
  const filteredChannels = searchQuery.trim()
    ? allChannels.filter(ch => ch.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : allChannels;

  const handleChannelClick = (ch: Channel) => {
    if (ch.badge) {
      setChannels(prev => sortChannels(prev.map(c => c.label === ch.label ? { ...c, badge: undefined } : c)));
    }
    onSelectChannel({ label: ch.label, icon: ch.icon, iconBg: ch.iconColorHex || ch.iconBg });
    closeSearch();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyMap: Record<string, string> = {
        '1': 'Customer Success',
        '2': 'Financeiro',
        '3': 'Desenvolvimento',
        '4': 'Marketing',
      };

      const targetLabel = keyMap[e.key];
      if (targetLabel) {
        setChannels((prev) => {
          const updated = prev.map((ch) => {
            if (ch.label === targetLabel) {
              return { ...ch, badge: (ch.badge || 0) + 1, lastNotificationAt: Date.now() };
            }
            return ch;
          });
          return sortChannels(updated);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateChannel = (data: { name: string; icon: React.ElementType; color: string }) => {
    setChannels((prev) => [
      ...prev,
      { icon: data.icon, label: data.name || "Novo canal", iconBg: data.color, iconColorHex: data.color },
    ]);
    setCreateModalOpen(false);
    notification.success({
      message: "Canal criado com sucesso",
      duration: 4,
      icon: (
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#079455", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      ),
      placement: "topRight",
    });
  };

  const handleSaveChannel = (data: { name: string; icon: React.ElementType; color: string }) => {
    if (!editingChannel) return;
    setChannels((prev) =>
      prev.map((ch) =>
        ch.label === editingChannel.label
          ? { ...ch, label: data.name, icon: data.icon, iconBg: data.color, iconColorHex: data.color }
          : ch
      )
    );
    setEditingChannel(null);
    notification.success({
      message: "Canal editado com sucesso",
      duration: 4,
      icon: (
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#079455", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      ),
      placement: "topRight",
    });
  };

  const handleTogglePin = (label: string) => {
    setChannels((prev) => {
      const updated = prev.map((ch) => ch.label === label ? { ...ch, pinned: !ch.pinned } : ch);
      return sortChannels(updated);
    });
  };

  const handleDeleteChannelRequest = (channel: Channel) => {
    setDeletingChannel(channel);
  };

  const confirmDeleteChannel = () => {
    if (!deletingChannel) return;

    setChannels((prev) => prev.filter((ch) => ch.label !== deletingChannel.label));
    if (editingChannel?.label === deletingChannel.label) {
      setEditingChannel(null);
      setEditModalOpen(false);
    }

    notification.error({
      message: "Canal excluído com sucesso",
      description: `O canal ${deletingChannel.label} foi excluído permanentemente.`,
      duration: 4,
      icon: (
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#D92D20", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          <X size={14} color="#fff" strokeWidth={3} />
        </div>
      ),
      placement: "topRight",
    });

    setDeletingChannel(null);
  };

  return (
    <Flex vertical gap={12} style={{ width: 288, flexShrink: 0, position: "sticky", top: 24, padding: "0 0 16px 0", ...style }}>

      {/* ── Channels card ── */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{ borderRadius: 16, border: "1px solid #E9EAEB", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}
      >
        {/* Header */}
        <Flex
          align="center" justify="space-between"
          style={{ padding: "0 12px 0 16px", height: 60, borderBottom: "1px solid #E9EAEB", gap: 8 }}
        >
          {searchActive ? (
            /* ── Search mode ── */
            <>
              <Flex align="center" gap={8} style={{ flex: 1, height: 36, borderRadius: 8, border: "1px solid #1570EF", padding: "0 10px", background: "#F5F8FF", boxShadow: "0 0 0 3px #D1E9FF" }}>
                <Search size={15} color="#1570EF" style={{ flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Escape" && closeSearch()}
                  placeholder="Buscar canal..."
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#181D27", fontFamily: "inherit" }}
                />
              </Flex>
              <button
                onClick={closeSearch}
                style={{ ...iconBtnStyle, flexShrink: 0 }}
                title="Fechar busca"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            /* ── Normal mode ── */
            <>
              <Typography.Text strong style={{ fontSize: 15, color: "#414651" }}>Canais</Typography.Text>
              <Flex gap={6}>
                <button
                  onClick={openSearch}
                  style={iconBtnStyle}
                  title="Buscar canal"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  style={{ ...iconBtnStyle, background: "#fff", color: "#344054", border: "1px solid #D5D7DA", boxShadow: "0 1px 2px rgba(10,13,18,0.05)" }}
                >
                  <Plus size={18} strokeWidth={2} />
                </button>
              </Flex>
            </>
          )}
        </Flex>

        {/* ── Search results ── */}
        {searchActive ? (
          <div style={{ padding: "8px 12px 12px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }} className="thin-scrollbar">
            {filteredChannels.length === 0 ? (
              <div style={{ padding: "24px 8px", textAlign: "center" }}>
                <Typography.Text style={{ fontSize: 13, color: "#A4A7AE" }}>
                  Nenhum canal encontrado para "<strong>{searchQuery}</strong>"
                </Typography.Text>
              </div>
            ) : (
              <>
                <Typography.Text style={{ fontSize: 12, color: "#A4A7AE", fontWeight: 500, padding: "4px 8px", display: "block", marginBottom: 2 }}>
                  {filteredChannels.length} canal{filteredChannels.length !== 1 ? "is" : ""} encontrado{filteredChannels.length !== 1 ? "s" : ""}
                </Typography.Text>
                {filteredChannels.map((ch) => (
                  <ChannelItem
                    key={ch.label}
                    channel={ch}
                    isActive={ch.label === selectedChannel}
                    onClick={() => handleChannelClick(ch)}
                    onTogglePin={handleTogglePin}
                    onEdit={(c) => { setEditingChannel(c); setEditModalOpen(true); }}
                    onDelete={fixedChannels.some(f => f.label === ch.label) ? undefined : handleDeleteChannelRequest}
                  />
                ))}
              </>
            )}
          </div>
        ) : (
          /* ── Normal channel list ── */
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }} className="thin-scrollbar">
            {/* Fixed channels */}
            <div style={{ padding: "12px 12px 0" }}>
              {fixedChannels.map((ch) => (
                <ChannelItem
                  key={ch.label}
                  channel={ch}
                  isActive={ch.label === selectedChannel}
                  onClick={() => handleChannelClick(ch)}
                  onTogglePin={handleTogglePin}
                  onEdit={(c) => { setEditingChannel(c); setEditModalOpen(true); }}
                />
              ))}
            </div>

            {/* Segmented channels */}
            <div style={{ padding: "0 12px 12px" }}>
              <button
                onClick={() => setSegmentedOpen(!segmentedOpen)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "8px 4px", color: "#535862", fontSize: 14, fontWeight: 500 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: segmentedOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
                  <ChevronDown size={16} color="#414651" />
                </div>
                Canais segmentados
              </button>

              {!segmentedOpen && channels.filter(ch => ch.badge && ch.badge > 0).map((ch) => (
                <ChannelItem
                  key={ch.label}
                  channel={ch}
                  isActive={ch.label === selectedChannel}
                  onClick={() => handleChannelClick(ch)}
                  onTogglePin={handleTogglePin}
                  onEdit={(c) => { setEditingChannel(c); setEditModalOpen(true); }}
                  onDelete={handleDeleteChannelRequest}
                />
              ))}

              <div style={{ display: "grid", gridTemplateRows: segmentedOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.2s ease-in-out" }}>
                <div style={{ overflow: "hidden" }}>
                  {segmentedOpen
                    ? channels.map((ch) => (
                        <ChannelItem
                          key={ch.label}
                          channel={ch}
                          isActive={ch.label === selectedChannel}
                          onClick={() => handleChannelClick(ch)}
                          onTogglePin={handleTogglePin}
                          onEdit={(c) => { setEditingChannel(c); setEditModalOpen(true); }}
                          onDelete={handleDeleteChannelRequest}
                        />
                      ))
                    : channels.filter(ch => !ch.badge || ch.badge === 0).map((ch) => (
                        <ChannelItem
                          key={ch.label}
                          channel={ch}
                          isActive={ch.label === selectedChannel}
                          onClick={() => handleChannelClick(ch)}
                          onTogglePin={handleTogglePin}
                          onEdit={(c) => { setEditingChannel(c); setEditModalOpen(true); }}
                          onDelete={handleDeleteChannelRequest}
                        />
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateChannelModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateChannel={handleCreateChannel}
      />
      {editingChannel && (
        <EditChannelModal open={editModalOpen} onOpenChange={setEditModalOpen} channelName={editingChannel.label} channelIcon={editingChannel.icon} channelColor={editingChannel.iconColorHex || editingChannel.iconBg} onSave={handleSaveChannel} />
      )}

      <DeleteModal
        open={!!deletingChannel}
        title="Excluir canal"
        description={`Deseja mesmo excluir o canal "${deletingChannel?.label}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onCancel={() => setDeletingChannel(null)}
        onConfirm={confirmDeleteChannel}
      />
    </Flex>
  );
};

/* ── Channel item row ── */
const ChannelItem = ({
  channel,
  isActive,
  onClick,
  onTogglePin,
  onEdit,
  onDelete,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  onTogglePin: (label: string) => void;
  onEdit: (ch: Channel) => void;
  onDelete?: (ch: Channel) => void;
}) => {
  const bgColor = channel.iconColorHex || channel.iconBg;

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: (
        <Flex align="center" gap={10}>
          <Pencil size={15} color="#535862" />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#414651" }}>Editar</span>
        </Flex>
      ),
      onClick: () => onEdit(channel),
    },
    ...(onDelete
      ? [{
          key: "delete",
          label: (
            <Flex align="center" gap={10}>
              <Trash2 size={15} color="#D92D20" />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#D92D20" }}>Excluir</span>
            </Flex>
          ),
          danger: true,
          onClick: () => onDelete(channel),
        }]
      : []),
  ];

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        width: "100%", minWidth: 0, boxSizing: "border-box", alignSelf: "stretch",
        padding: "0 8px", borderRadius: 10, cursor: "pointer",
        height: 42, marginBottom: 2,
        background: isActive ? "#EFF8FF" : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "#F5F5F5"; }}
      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      className="channel-item"
    >
      <Flex align="center" gap={10} style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <channel.icon size={15} color="#fff" strokeWidth={2} />
        </div>
        <Tooltip title={channel.label} placement="right" mouseEnterDelay={0.6} arrow={false}>
          <Typography.Text
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "#175CD3" : "#181D27",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              flex: 1,
              maxWidth: "100%",
              margin: 0,
            }}
          >
            {channel.label}
          </Typography.Text>
        </Tooltip>
      </Flex>

      <Flex align="center" gap={4} className="channel-actions" style={{ flexShrink: 0 }}>
        {channel.label !== "Geral" && channel.label !== "Aniversariantes" && (
          <>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <button
                onClick={(e) => e.stopPropagation()}
                style={{ ...iconBtnStyle, width: 26, height: 26, color: "#A4A7AE" }}
                className="channel-action-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </Dropdown>
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(channel.label); }}
              style={{ ...iconBtnStyle, width: 26, height: 26, color: channel.pinned ? "#535862" : "#A4A7AE" }}
              className="channel-action-btn"
              title={channel.pinned ? "Desafixar canal" : "Fixar canal"}
            >
              <Pin size={15} strokeWidth={channel.pinned ? 2.5 : 2} fill={channel.pinned ? "currentColor" : "none"} />
            </button>
          </>
        )}
      </Flex>

      {channel.badge ? (
        <span
          style={{
            flexShrink: 0,
            minWidth: 18,
            height: 18,
            padding: "0 5px",
            borderRadius: 9,
            background: "#FEF3F2",
            color: "#B42318",
            border: "1px solid #FECDCA",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {channel.badge > 99 ? "99+" : channel.badge}
        </span>
      ) : null}
    </div>
  );
};

const iconBtnStyle: React.CSSProperties = {
  width: 36, height: 36,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  color: "#A4A7AE",
  flexShrink: 0,
  transition: "background 0.15s, color 0.15s",
};

export default ChannelsSidebar;
