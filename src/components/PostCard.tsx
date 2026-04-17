import {
  ThumbsUp, ThumbsDown, MessageSquare, Share2,
  MoreHorizontal, Trash2, ChevronDown, ChevronUp, Pencil, X, ArrowRight, Smile,
  Briefcase, MapPin, Pin, Flame,
} from "lucide-react";
import { Avatar, Button, Dropdown, Flex, Input, Popover, Tag, Typography, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useState, useRef, type CSSProperties } from "react";
import DeleteModal from "./DeleteModal";

const AUTHOR_INFO: Record<string, { role: string; area: string }> = {
  "Bruno Delorence":  { role: "Product Design Lead",       area: "Design" },
  "Ana Costa":        { role: "UX Researcher",             area: "User Insights" },
  "Carlos Mendes":    { role: "Engenheiro de Software",    area: "Desenvolvimento" },
  "Fernanda Lima":    { role: "Product Manager",           area: "Produto" },
  "Rafael Souza":     { role: "Tech Lead",                 area: "Desenvolvimento" },
  "Juliana Rocha":    { role: "Designer UX/UI",            area: "Design" },
  "Pedro Alves":      { role: "Gerente de Projetos",       area: "Gestão" },
  "Camila Torres":    { role: "Analista de Dados",         area: "Data & BI" },
  "Diego Ferreira":   { role: "Desenvolvedor Front-end",   area: "Desenvolvimento" },
  "Mariana Oliveira": { role: "Especialista em Marketing", area: "Marketing" },
  "Joan Pierre":      { role: "Content Strategist",        area: "Comunicação" },
  "Skill Sprout":     { role: "Community Manager",         area: "Customer Success" },
  "Marcos Silva":     { role: "Consultor de Negócios",     area: "Comercial" },
  "Mariana":          { role: "Analista de RH",            area: "RH" },
  "Alana Rhye":       { role: "Head de Comunicação",       area: "Comunicação" },
};

const AuthorHoverCard = ({ name, avatarSrc, children }: { name: string; avatarSrc: string; children: React.ReactNode }) => {
  const info = AUTHOR_INFO[name] ?? { role: "Colaborador", area: "Geral" };

  const content = (
    <div style={{ width: 280 }}>
      <div style={{ width: "100%", height: 120, overflow: "hidden" }}>
        <img
          src={avatarSrc}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
        />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <Typography.Text strong style={{ fontSize: 15, color: "#101828", display: "block", lineHeight: "22px" }}>
          {name}
        </Typography.Text>
        <Flex align="center" gap={6} style={{ marginTop: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Briefcase size={12} color="#535862" />
          </div>
          <Typography.Text style={{ fontSize: 13, color: "#344054" }}>{info.role}</Typography.Text>
        </Flex>
        <Flex align="center" gap={6} style={{ marginTop: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <MapPin size={12} color="#535862" />
          </div>
          <Typography.Text style={{ fontSize: 13, color: "#344054" }}>{info.area}</Typography.Text>
        </Flex>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="hover"
      placement="bottomLeft"
      arrow={false}
      mouseEnterDelay={0.35}
      overlayInnerStyle={{ borderRadius: 14, padding: 0, overflow: "hidden", boxShadow: "0 12px 40px rgba(10,13,18,0.16)" }}
    >
      <span style={{ cursor: "pointer" }}>{children}</span>
    </Popover>
  );
};
import PostMediaPhoto from "./PostMediaPhoto";
import ImageViewerModal from "./ImageViewerModal";
import PostMediaTwoPhotos from "./PostMediaTwoPhotos";
import PostMediaGallery from "./PostMediaGallery";
import PostMediaVideo from "./PostMediaVideo";
import PostMediaAudio from "./PostMediaAudio";
import PostMediaAudioBanner from "./PostMediaAudioBanner";
import PostMediaLink from "./PostMediaLink";
import SharePostModal from "./SharePostModal";
import { avatar as avatarByName } from "@/lib/avatar";

interface Reply {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  replies: Reply[];
}

interface PostMedia {
  images?: string[];
  videoCover?: string;
  videoDuration?: string;
  audioTitle?: string;
  audioDuration?: string;
}

interface PostCardProps {
  author: string;
  avatar: string;
  time: string;
  content: string;
  isNew?: boolean;
  /** Total de curtidas/reações na postagem (métrica do feed) */
  likes?: number;
  /** Admin: destaca post com muito engajamento */
  showHighEngagementBadge?: boolean;
  comments: number;
  shares: number;
  truncated?: boolean;
  type?: "text" | "photo" | "2photos" | "gallery" | "video" | "audio" | "audio_banner" | "link";
  linkMeta?: { title: string; domain: string; image?: string; url?: string };
  media?: PostMedia;
  defaultCommentsOpen?: boolean;
  onDelete?: () => void;
  onCommentDeleted?: () => void;
}

const initialComments: Comment[] = [
  {
    id: "c1",
    author: "Joan Pierre",
    avatar: "/assets/avatar-juliana-rocha.png",
    time: "58 minutos atrás",
    text: "Ela merece todo reconhecimento! Uma profissional de fato exemplar!",
    likes: 25,
    replies: [
      {
        id: "r1",
        author: "Skill Sprout",
        avatar: "/assets/avatar-camila-torres.png",
        time: "62 minutos atrás",
        text: "A maioria que esta aqui comigo me conhece por causa do meu trabalho. Talvez vocês não saibam, mas nos momentos mais complicados da minha carreira, vocês estavam aqui me mandando tanta energia positiva que me ajudaram a não desistir! E é por isso que sempre que eu posso faço questão de agradecer a parceria de vocês! 🙏E hoje, nesse primeiro de maio, eu agradeço pelo meu trabalho e por vocês me ajudarem a realiza-lo sempre com um sorriso no rosto.",
        likes: 25,
      },
    ],
  },
  {
    id: "c2",
    author: "Marcos Silva",
    avatar: "/assets/avatar-carlos-mendes.png",
    time: "58 minutos atrás",
    text: "E é por isso que sempre que eu posso faço questão de agradecer a parceria de vocês!",
    likes: 25,
    replies: [],
  },
];

const reactions = [
  { label: "Curtir", emoji: "👍", color: "#1877F2" },
  { label: "Amei", emoji: "❤️", color: "#F02849" },
  { label: "Força", emoji: "🥰", color: "#F02849" },
  { label: "Haha", emoji: "😆", color: "#F7B125" },
  { label: "Uau", emoji: "😮", color: "#F7B125" },
  { label: "Triste", emoji: "😢", color: "#F7B125" },
  { label: "Grr", emoji: "😡", color: "#E4605E" },
];

const POST_REACTION_PREVIEW_NAMES = ["Bruno Delorence", "Ana Costa", "Fernanda Lima"] as const;

/** Distribuição simulada proporcional ao total de curtidas (soma = total) */
function reactionBreakdownForTotal(total: number) {
  if (total <= 0) {
    return [
      { emoji: "👍", label: "Curtir", count: 0 },
      { emoji: "😆", label: "Haha", count: 0 },
      { emoji: "❤️", label: "Amei", count: 0 },
    ];
  }
  const a = Math.max(1, Math.round(total * 0.64));
  const b = Math.max(0, Math.round(total * 0.22));
  const c = Math.max(0, total - a - b);
  return [
    { emoji: "👍", label: "Curtir", count: a },
    { emoji: "😆", label: "Haha", count: b },
    { emoji: "❤️", label: "Amei", count: c },
  ];
}

const STATS_POPOVER_OVERLAY: CSSProperties = {
  padding: 0,
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 10px 38px rgba(10,13,18,0.14)",
};

// Renders text with @mentions highlighted in blue, with profile hover card
const renderWithMentions = (text: string): React.ReactNode[] => {
  // Matches @FirstName or @FirstName LastName (two-word names joined by a space)
  const parts = text.split(/(@\w+(?:\s\w+)?)/g);
  return parts.map((part, i) => {
    if (!part.startsWith("@")) return part;
    const name = part.slice(1); // remove @
    return (
      <AuthorHoverCard key={i} name={name} avatarSrc={avatarByName(name)}>
        <span style={{ color: "#1570EF", fontWeight: 500, cursor: "pointer" }}>{part}</span>
      </AuthorHoverCard>
    );
  });
};

const PostCard = ({
  author, avatar, time, content, isNew, likes = 0, showHighEngagementBadge = false,
  comments, shares,
  truncated, type = "text", media, linkMeta, defaultCommentsOpen = false,
  onDelete, onCommentDeleted,
}: PostCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>(initialComments);
  const [sortNewest, setSortNewest] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<{ label: string; emoji: string; color: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // comment id being replied to
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const [seen, setSeen] = useState(!isNew);

  const TRUNCATE_LIMIT = 275;
  const shouldTruncate = content.length > TRUNCATE_LIMIT;
  const displayContent = !expanded && shouldTruncate ? content.slice(0, TRUNCATE_LIMIT).trimEnd() : content;

  // ── Add top-level comment ──
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: String(Date.now()),
      author: "Mariana",
      avatar: "/assets/avatar-mariana-oliveira.png",
      time: "Agora",
      text: commentText.trim(),
      likes: 0,
      replies: [],
    };
    setCommentsList((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  // ── Add reply ──
  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const newReply: Reply = {
      id: String(Date.now()),
      author: "Mariana",
      avatar: "/assets/avatar-mariana-oliveira.png",
      time: "Agora",
      text: replyText.trim(),
      likes: 0,
    };
    setCommentsList((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  };

  // ── Delete top-level comment or reply ──
  const handleDeleteComment = () => {
    if (!deleteCommentId) return;
    // Check if it's a reply (format: "parentId:replyId")
    if (deleteCommentId.includes(":")) {
      const [parentId, replyId] = deleteCommentId.split(":");
      setCommentsList((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
        )
      );
    } else {
      setCommentsList((prev) => prev.filter((c) => c.id !== deleteCommentId));
    }
    setDeleteCommentId(null);
    onCommentDeleted?.();
  };

  const totalComments = commentsList.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const displayed = sortNewest
    ? [...commentsList].sort((a) => (a.time === "Agora" ? -1 : 1))
    : commentsList;

  const [pinned, setPinned] = useState(false);

  const postMenuItems: MenuProps["items"] = [
    {
      key: "pin",
      label: (
        <Flex align="center" gap={8}>
          <Pin size={15} fill={pinned ? "currentColor" : "none"} />
          <span>{pinned ? "Desafixar postagem" : "Fixar postagem"}</span>
        </Flex>
      ),
      onClick: () => setPinned(v => !v),
    },
    { type: "divider" },
    {
      key: "delete",
      label: (
        <Flex align="center" gap={8}>
          <Trash2 size={15} /><span>Excluir postagem</span>
        </Flex>
      ),
      danger: true,
      onClick: () => setShowDeleteDialog(true),
    },
  ];

  const commentMenuItems = (id: string): MenuProps["items"] => [
    { key: "edit", label: <Flex align="center" gap={8}><Pencil size={13} /><span>Editar</span></Flex> },
    { key: "delete", label: <Flex align="center" gap={8}><Trash2 size={13} /><span>Excluir</span></Flex>, danger: true, onClick: () => setDeleteCommentId(id) },
  ];

  const replyMenuItems = (parentId: string, replyId: string): MenuProps["items"] => [
    { key: "edit", label: <Flex align="center" gap={8}><Pencil size={13} /><span>Editar</span></Flex> },
    { key: "delete", label: <Flex align="center" gap={8}><Trash2 size={13} /><span>Excluir</span></Flex>, danger: true, onClick: () => setDeleteCommentId(`${parentId}:${replyId}`) },
  ];

  const reactionsContent = (
    <Flex gap={8} style={{ padding: "4px 2px" }}>
      {reactions.map((r) => (
        <Tooltip key={r.label} title={r.label} mouseEnterDelay={0.1}>
          <button
            onClick={() => setSelectedReaction(selectedReaction?.label === r.label ? null : r)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 24, padding: 0, transition: "transform 0.2s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3) translateY(-4px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) translateY(0)")}
          >
            {r.emoji}
          </button>
        </Tooltip>
      ))}
    </Flex>
  );

  const displayedCommentCount =
    comments + totalComments - initialComments.reduce((a, c) => a + 1 + c.replies.length, 0);

  const reactionRows = reactionBreakdownForTotal(likes);
  const othersReacted = Math.max(0, likes - POST_REACTION_PREVIEW_NAMES.length);

  const reactionsInsightContent = (
    <div style={{ width: 268, maxHeight: 300, overflowY: "auto" }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #F2F4F7" }}>
        <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>
          Reações · {likes}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 11, color: "#667085", display: "block", marginTop: 2 }}>
          Distribuição por tipo
        </Typography.Text>
      </div>
      <div style={{ padding: "10px 14px" }}>
        <Flex vertical gap={8}>
          {reactionRows.map((row) => (
            <Flex key={row.label} align="center" justify="space-between" style={{ fontSize: 12 }}>
              <Flex align="center" gap={8}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{row.emoji}</span>
                <Typography.Text style={{ color: "#344054" }}>{row.label}</Typography.Text>
              </Flex>
              <Typography.Text strong style={{ color: "#101828", fontVariantNumeric: "tabular-nums" }}>{row.count}</Typography.Text>
            </Flex>
          ))}
        </Flex>
      </div>
      <div style={{ padding: "0 14px 12px" }}>
        <Typography.Text style={{ fontSize: 11, color: "#667085", display: "block", marginBottom: 8 }}>
          Algumas pessoas que reagiram
        </Typography.Text>
        <Flex vertical gap={8}>
          {POST_REACTION_PREVIEW_NAMES.map((name) => (
            <Flex key={name} align="center" gap={10}>
              <Avatar src={avatarByName(name)} size={28} style={{ flexShrink: 0 }} />
              <Typography.Text style={{ fontSize: 12, color: "#101828", fontWeight: 500 }}>{name}</Typography.Text>
            </Flex>
          ))}
        </Flex>
        <Typography.Text style={{ fontSize: 11, color: "#98A2B3", marginTop: 10, display: "block" }}>
          {likes > 0 ? (othersReacted > 0 ? `e outras ${othersReacted} pessoas` : "Todas as reações listadas acima") : "Nenhuma reação ainda"}
        </Typography.Text>
      </div>
    </div>
  );

  const commentsInsightContent = (
    <div style={{ width: 280, maxHeight: 280, overflowY: "auto" }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #F2F4F7" }}>
        <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>
          Comentários · {displayedCommentCount}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 11, color: "#667085", display: "block", marginTop: 2 }}>
          Prévia das mensagens
        </Typography.Text>
      </div>
      <div style={{ padding: "10px 14px 12px" }}>
        {displayed.length === 0 ? (
          <Typography.Text style={{ fontSize: 12, color: "#98A2B3" }}>Nenhum comentário ainda.</Typography.Text>
        ) : (
          <Flex vertical gap={12}>
            {displayed.slice(0, 5).map((c) => (
              <Flex key={c.id} gap={10} align="flex-start">
                <Avatar src={c.avatar} size={32} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Flex align="center" gap={6} wrap="wrap">
                    <Typography.Text strong style={{ fontSize: 12, color: "#101828" }}>{c.author}</Typography.Text>
                    <Typography.Text style={{ fontSize: 11, color: "#98A2B3" }}>{c.time}</Typography.Text>
                  </Flex>
                  <Typography.Text
                    style={{ fontSize: 12, color: "#475467", lineHeight: "18px", display: "block", marginTop: 4 }}
                    ellipsis={{ rows: 2 }}
                  >
                    {c.text}
                  </Typography.Text>
                </div>
              </Flex>
            ))}
          </Flex>
        )}
      </div>
    </div>
  );

  const sharePreview = [
    { name: "Mariana Oliveira", detail: "Canal Geral · há 2 h" },
    { name: "Pedro Alves", detail: "Mensagem direta · há 5 h" },
    { name: "Camila Torres", detail: "Link copiado · ontem" },
  ] as const;

  const sharesInsightContent = (
    <div style={{ width: 268 }}>
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #F2F4F7" }}>
        <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>
          Compartilhamentos · {shares}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 11, color: "#667085", display: "block", marginTop: 2 }}>
          Onde esta postagem circulou
        </Typography.Text>
      </div>
      <div style={{ padding: "12px 14px" }}>
        {shares <= 0 ? (
          <Typography.Text style={{ fontSize: 12, color: "#98A2B3" }}>Nenhum compartilhamento registrado.</Typography.Text>
        ) : (
          <Flex vertical gap={12}>
            {sharePreview.slice(0, Math.min(shares, 3)).map((row, i) => (
              <Flex key={i} align="center" gap={10}>
                <Avatar src={avatarByName(row.name)} size={28} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <Typography.Text style={{ fontSize: 12, color: "#101828", fontWeight: 600, display: "block" }}>{row.name}</Typography.Text>
                  <Typography.Text style={{ fontSize: 11, color: "#667085" }}>{row.detail}</Typography.Text>
                </div>
              </Flex>
            ))}
            {shares > 3 && (
              <Typography.Text style={{ fontSize: 11, color: "#98A2B3" }}>
                +{shares - 3} {shares - 3 === 1 ? "outro compartilhamento" : "outros compartilhamentos"}
              </Typography.Text>
            )}
          </Flex>
        )}
      </div>
    </div>
  );

  return (
    <article
      onMouseEnter={() => { if (!seen) setSeen(true); }}
      style={{
        background: "#fff",
        borderRadius: 16,
        border: seen ? "1px solid #E9EAEB" : "1px solid #B2DDFF",
        padding: "20px 24px",
        boxShadow: seen ? "0 1px 2px rgba(10,13,18,0.04)" : "0 0 0 3px #EFF8FF, 0 1px 2px rgba(10,13,18,0.04)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pinned header */}
      {pinned && (
        <Flex align="center" gap={6} style={{
          margin: "-20px -24px 16px -24px",
          padding: "7px 24px",
          borderBottom: "1px solid #F2F4F7",
          background: "#FAFAFA",
        }}>
          <Pin size={11} color="#98A2B3" strokeWidth={2} />
          <Typography.Text style={{ fontSize: 11, fontWeight: 500, color: "#98A2B3", letterSpacing: "0.02em" }}>
            Fixada
          </Typography.Text>
        </Flex>
      )}

      {/* Unread dot */}
      {!seen && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 8, height: 8, borderRadius: "50%",
          background: "#1570EF",
          boxShadow: "0 0 0 3px #EFF8FF",
          transition: "opacity 0.3s",
        }} />
      )}

      {/* ── Author ── */}
      <Flex align="flex-start" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center" gap={12}>
          <AuthorHoverCard name={author} avatarSrc={avatar}>
            <Avatar src={avatar} size={40} style={{ border: "1px solid #EAECF0" }} />
          </AuthorHoverCard>
          <div>
            <Flex align="center" gap={6}>
              <AuthorHoverCard name={author} avatarSrc={avatar}>
                <Typography.Text strong style={{ fontSize: 14, color: "#101828", fontWeight: 600 }}>{author}</Typography.Text>
              </AuthorHoverCard>
              {isNew && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#175CD3",
                  background: "#EFF8FF", border: "1px solid #B2DDFF",
                  padding: "1px 8px", borderRadius: 16, letterSpacing: "0.02em",
                }}>
                  NOVO!
                </span>
              )}
              {showHighEngagementBadge && (
                <Tooltip title="Alto engajamento: muitas curtidas, comentários e compartilhamentos. Visível para administradores.">
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 8px", borderRadius: 16,
                      background: "linear-gradient(135deg, #FFF4ED 0%, #FFEDD5 100%)",
                      border: "1px solid #FDB022",
                      fontSize: 11, fontWeight: 700, color: "#B93815", lineHeight: "16px",
                    }}
                  >
                    <Flame size={12} color="#E62E05" fill="#FF692E" strokeWidth={2} style={{ flexShrink: 0 }} />
                    Em alta
                  </span>
                </Tooltip>
              )}
            </Flex>
            <Typography.Text style={{ fontSize: 12, color: "#667085", display: "block", marginTop: -2 }}>{time}</Typography.Text>
          </div>
        </Flex>
        <Dropdown menu={{ items: postMenuItems }} trigger={["click"]} placement="bottomRight">
          <button style={ghostBtn}><MoreHorizontal size={17} /></button>
        </Dropdown>
      </Flex>

      {/* Share modal */}
      <SharePostModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        postAuthor={author}
        postContent={content}
      />

      {/* Delete post modal */}
      <DeleteModal
        open={showDeleteDialog}
        title="Excluir postagem"
        description="Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => { onDelete?.(); setShowDeleteDialog(false); }}
      />

      {/* Delete comment/reply modal */}
      <DeleteModal
        open={!!deleteCommentId}
        title="Excluir comentário"
        description="Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onCancel={() => setDeleteCommentId(null)}
        onConfirm={handleDeleteComment}
      />

      {/* ── Content ── */}
      <div style={{ marginBottom: 16 }}>
        <Typography.Text style={{ fontSize: 14, color: "#344054", lineHeight: "22px", whiteSpace: "pre-line" }}>
          {renderWithMentions(displayContent)}
          {shouldTruncate && !expanded && (
            <span>... <a onClick={() => setExpanded(true)} style={{ color: "#1570EF", fontWeight: 700, cursor: "pointer" }}>Ler mais</a></span>
          )}
          {shouldTruncate && expanded && (
            <span> <a onClick={() => setExpanded(false)} style={{ color: "#1570EF", fontWeight: 700, cursor: "pointer" }}>Ler menos</a></span>
          )}
        </Typography.Text>
      </div>

      {/* ── Media ── */}
      {type === "photo" && media?.images?.[0] && <PostMediaPhoto src={media.images[0]} onClick={() => { setViewerIdx(0); setViewerOpen(true); }} />}
      {type === "2photos" && media?.images && <div onClick={() => { setViewerIdx(0); setViewerOpen(true); }} style={{ cursor: "pointer" }}><PostMediaTwoPhotos images={media.images} /></div>}
      {type === "gallery" && media?.images && <div onClick={() => { setViewerIdx(0); setViewerOpen(true); }} style={{ cursor: "pointer" }}><PostMediaGallery images={media.images} /></div>}
      {type === "video" && media?.videoCover && <PostMediaVideo coverUrl={media.videoCover} duration={media.videoDuration} />}
      {type === "audio" && <PostMediaAudio title={media?.audioTitle} duration={media?.audioDuration} />}
      {type === "audio_banner" && <PostMediaAudioBanner bannerUrl={media?.images?.[0]} title={media?.audioTitle} duration={media?.audioDuration} />}
      {type === "link" && linkMeta && <PostMediaLink {...linkMeta} />}

      {/* ── Image Viewer ── */}
      {media?.images && media.images.length > 0 && (
        <ImageViewerModal
          open={viewerOpen}
          images={media.images}
          initialIndex={viewerIdx}
          postAuthor={author}
          postAvatar={avatar}
          postTime={time}
          postContent={content}
          isNew={isNew}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* ── Actions ── */}
      <div style={{ borderTop: "1px solid #F2F4F7", margin: "0 -24px", marginBottom: 0 }} />
      <Flex align="center" justify="space-between" style={{ paddingTop: 6, paddingBottom: 4 }}>
        <Flex gap={4}>
          <Popover content={reactionsContent} trigger="hover" placement="topLeft" overlayInnerStyle={{ borderRadius: 50, padding: "4px 8px" }}>
            <button
              onClick={() => setSelectedReaction(selectedReaction ? null : { label: "Curtir", emoji: "👍", color: "#1877F2" })}
              style={{ ...modernActionStyle, color: selectedReaction ? selectedReaction.color : "#535862", fontWeight: selectedReaction ? 600 : 500 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {selectedReaction
                ? <span style={{ fontSize: 17, lineHeight: 1 }}>{selectedReaction.emoji}</span>
                : <ThumbsUp size={17} strokeWidth={1.75} />}
              {selectedReaction ? selectedReaction.label : "Curtir"}
            </button>
          </Popover>
          <button
            onClick={() => { const willOpen = !commentsOpen; setCommentsOpen(willOpen); if (willOpen) setTimeout(() => commentInputRef.current?.focus(), 100); }}
            style={{ ...modernActionStyle, color: commentsOpen ? "#1570EF" : "#535862", fontWeight: commentsOpen ? 600 : 500 }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <MessageSquare size={17} strokeWidth={1.75} />
            Comentar
          </button>
          <button
            onClick={() => setShareOpen(true)}
            style={modernActionStyle}
            onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Share2 size={17} strokeWidth={1.75} />
            Compartilhar
          </button>
        </Flex>
        <Flex gap={14} align="center">
          <Popover
            content={reactionsInsightContent}
            trigger="hover"
            placement="topRight"
            mouseEnterDelay={0.22}
            arrow={false}
            overlayInnerStyle={STATS_POPOVER_OVERLAY}
          >
            <Flex align="center" gap={4} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", zIndex: 2 }}>
                  <ThumbsUp size={9} color="#fff" fill="#fff" />
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F7B125", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: -6, zIndex: 1 }}>
                  <span style={{ fontSize: 9, lineHeight: 1 }}>😆</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: "#535862", fontVariantNumeric: "tabular-nums" }}>{likes}</span>
            </Flex>
          </Popover>
          <Popover
            content={commentsInsightContent}
            trigger="hover"
            placement="top"
            mouseEnterDelay={0.22}
            arrow={false}
            overlayInnerStyle={STATS_POPOVER_OVERLAY}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#A4A7AE", cursor: "pointer" }}>
              <MessageSquare size={13} /> <span style={{ fontVariantNumeric: "tabular-nums" }}>{displayedCommentCount}</span>
            </span>
          </Popover>
          <Popover
            content={sharesInsightContent}
            trigger="hover"
            placement="topLeft"
            mouseEnterDelay={0.22}
            arrow={false}
            overlayInnerStyle={STATS_POPOVER_OVERLAY}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#A4A7AE", cursor: "pointer" }}>
              <Share2 size={13} /> <span style={{ fontVariantNumeric: "tabular-nums" }}>{shares}</span>
            </span>
          </Popover>
        </Flex>
      </Flex>

      {/* ── Comments section (input + list) ── */}
      {commentsOpen && (<>
      <Flex align="flex-end" gap={12} style={{ padding: "20px 0" }}>
        <Avatar src={avatar} size={40} style={{ flexShrink: 0 }} />
        <div
          style={{
            flex: 1, display: "flex", alignItems: "flex-end", gap: 8,
            border: "1px solid #D0D5DD", borderRadius: 24,
            padding: "6px 6px 6px 16px",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1570EF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#D0D5DD")}
        >
          <Input.TextArea
            ref={commentInputRef as any}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="Adicione um comentário..."
            autoSize={{ minRows: 1, maxRows: 6 }}
            variant="borderless"
            style={{
              flex: 1, resize: "none", fontSize: 14, padding: "4px 0",
              lineHeight: "22px", color: "#344054",
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "none", cursor: commentText.trim() ? "pointer" : "default",
              background: commentText.trim() ? "#1570EF" : "#E9EAEB",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.2s",
            }}
          >
            <ArrowRight size={16} color={commentText.trim() ? "#fff" : "#A4A7AE"} />
          </button>
        </div>
      </Flex>

      <button
        onClick={() => setCommentsOpen((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#414651", marginBottom: 12, padding: 0, fontFamily: "inherit" }}
      >
        <ChevronUp size={18} />
        Ocultar comentários
      </button>

      <div>
          <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
            <Flex align="center" gap={8}>
              <Typography.Text strong style={{ fontSize: 16, color: "#101828" }}>Comments</Typography.Text>
              <Tag color="#1570EF" style={{ background: "#1570EF", color: "#fff", border: "none", fontWeight: 700, borderRadius: 99 }}>{totalComments}</Tag>
            </Flex>
            <Button
              size="small"
              type="text"
              icon={<ChevronDown size={12} style={{ transform: sortNewest ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
              iconPosition="end"
              onClick={() => setSortNewest((v) => !v)}
              style={{ color: "#475467", fontWeight: 500 }}
            >
              Mais recentes
            </Button>
          </Flex>

          <Flex vertical gap={0}>
            {displayed.map((comment) => {
              const hasReplies = comment.replies.length > 0;
              const isReplying = replyingTo === comment.id;

              return (
                <div key={comment.id} style={{ position: "relative" }}>

                  {/* Comment row */}
                  <Flex gap={12} align="stretch" style={{ paddingBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0, zIndex: 2 }}>
                      <Avatar src={comment.avatar} size={40} style={{ flexShrink: 0 }} />
                      {(hasReplies || isReplying) && (
                        <div style={{ flex: 1, width: 2, background: "#D5D7DA", marginTop: 4, marginBottom: -12 }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                      <Flex align="center" gap={8} style={{ marginBottom: 2 }}>
                        <Typography.Text strong style={{ fontSize: 14, color: "#101828" }}>{comment.author}</Typography.Text>
                        <Typography.Text style={{ fontSize: 12, color: "#717680" }}>{comment.time}</Typography.Text>
                        <Dropdown menu={{ items: commentMenuItems(comment.id) }} trigger={["click"]} placement="bottomRight">
                          <button style={{ ...ghostBtn, padding: "0 2px", marginLeft: 2 }}><MoreHorizontal size={15} /></button>
                        </Dropdown>
                      </Flex>
                      <Typography.Text style={{ fontSize: 14, color: "#475467", lineHeight: "20px", display: "block", marginBottom: 8 }}>
                        {renderWithMentions(comment.text)}
                      </Typography.Text>
                      <Flex align="center" gap={16}>
                        <button style={{ ...actionCountBtn }}>
                          <ThumbsUp size={16} strokeWidth={1.75} />
                          <span>{comment.likes}</span>
                        </button>
                        <button style={{ ...actionCountBtn }}>
                          <ThumbsDown size={16} strokeWidth={1.75} />
                          <span>0</span>
                        </button>
                        <button
                          style={{ ...actionCountBtn, color: isReplying ? "#1570EF" : "#717680" }}
                          onClick={() => {
                            setReplyingTo(isReplying ? null : comment.id);
                            setReplyText("");
                          }}
                        >
                          <MessageSquare size={16} strokeWidth={1.75} />
                          <span>Responder</span>
                        </button>
                      </Flex>

                    </div>
                  </Flex>

                  {/* ── Replies ── */}
                  {comment.replies.map((reply, rIdx) => {
                    const isLastItem = rIdx === comment.replies.length - 1 && !isReplying;
                    return (
                      <div key={reply.id} style={{ position: "relative", paddingLeft: 52, paddingBottom: isLastItem ? 20 : 8 }}>
                        {/* Connector from parent/prev reply to this reply */}
                        <div style={{
                          position: "absolute",
                          left: 17,
                          top: 0,
                          width: 35,
                          height: 16,
                          borderLeft: "2px solid #D5D7DA",
                          borderBottom: "2px solid #D5D7DA",
                          borderBottomLeftRadius: 14,
                        }} />
                        {/* If not last, continue vertical line down to next reply */}
                        {!isLastItem && (
                          <div style={{
                            position: "absolute",
                            left: 17,
                            top: 16,
                            bottom: 0,
                            width: 2,
                            background: "#D5D7DA"
                          }} />
                        )}
                        <Flex gap={12} align="flex-start">
                          <Avatar src={reply.avatar} size={40} style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Flex align="center" gap={8} style={{ marginBottom: 2 }}>
                              <Typography.Text strong style={{ fontSize: 14, color: "#101828" }}>{reply.author}</Typography.Text>
                              <Typography.Text style={{ fontSize: 12, color: "#717680" }}>{reply.time}</Typography.Text>
                              <Dropdown menu={{ items: replyMenuItems(comment.id, reply.id) }} trigger={["click"]} placement="bottomRight">
                                <button style={{ ...ghostBtn, padding: "0 2px", marginLeft: 2 }}><MoreHorizontal size={15} /></button>
                              </Dropdown>
                            </Flex>
                            <Typography.Text style={{ fontSize: 14, color: "#475467", lineHeight: "20px", display: "block", marginBottom: 8 }}>
                              {renderWithMentions(reply.text)}
                            </Typography.Text>
                            <Flex align="center" gap={16}>
                              <button style={{ ...actionCountBtn }}>
                                <ThumbsUp size={16} strokeWidth={1.75} />
                                <span>{reply.likes}</span>
                              </button>
                              <button style={{ ...actionCountBtn }}>
                                <ThumbsDown size={16} strokeWidth={1.75} />
                                <span>0</span>
                              </button>
                              <button
                                style={{ ...actionCountBtn }}
                                onClick={() => {
                                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                  setReplyText("");
                                }}
                              >
                                <MessageSquare size={16} strokeWidth={1.75} />
                                <span>Responder</span>
                              </button>
                            </Flex>
                          </div>
                        </Flex>
                      </div>
                    );
                  })}

                  {/* Inline reply input, rendered as the final "reply" in the list */}
                  {isReplying && (
                    <div style={{ position: "relative", paddingLeft: 52, paddingBottom: 20 }}>
                      <div style={{
                        position: "absolute",
                        left: 17,
                        top: 0,
                        width: 35,
                        height: 16,
                        borderLeft: "2px solid #D5D7DA",
                        borderBottom: "2px solid #D5D7DA",
                        borderBottomLeftRadius: 14,
                      }} />
                      <Flex align="center" gap={8}>
                        <Avatar src="/assets/avatar-mariana-oliveira.png" size={30} style={{ flexShrink: 0 }} />
                        <Input
                          autoFocus
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onPressEnter={() => handleAddReply(comment.id)}
                          placeholder={`Responder a ${comment.author}...`}
                          style={{ flex: 1, borderRadius: 8, height: 34, borderColor: "#1570EF", fontSize: 13 }}
                        />
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          style={{ height: 34, borderRadius: 8, fontWeight: 600 }}
                        >
                          Responder
                        </Button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                          style={{ ...ghostBtn, padding: 2 }}
                        >
                          <X size={15} />
                        </button>
                      </Flex>
                    </div>
                  )}
                </div>
              );
            })}
          </Flex>
        </div>
      </>)}
    </article>
  );
};

const ghostBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, color: "#A4A7AE", display: "flex", alignItems: "center", fontFamily: "inherit" };

const actionCountBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 5,
  background: "none", border: "none", cursor: "pointer",
  padding: "3px 8px", borderRadius: 6,
  fontSize: 13, color: "#717680", fontFamily: "inherit", fontWeight: 500,
  transition: "background 0.15s, color 0.15s",
};

const modernActionStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 7,
  background: "transparent", border: "none", cursor: "pointer",
  padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
  color: "#535862", fontFamily: "inherit",
  transition: "background 0.15s, color 0.15s",
};

export default PostCard;
