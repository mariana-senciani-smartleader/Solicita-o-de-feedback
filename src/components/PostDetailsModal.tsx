import { Flex, Avatar, Typography } from "antd";
import { X, Clock, AlertCircle, CheckCircle2, Trash2, Pencil, Send, RefreshCw, ExternalLink, FileText, FileSpreadsheet, File } from "lucide-react";
import type { ScheduledPost } from "./CreatePostModal";
import PostMediaPhoto from "./PostMediaPhoto";
import PostMediaTwoPhotos from "./PostMediaTwoPhotos";
import PostMediaGallery from "./PostMediaGallery";
import PostMediaVideo from "./PostMediaVideo";
import PostMediaAudio from "./PostMediaAudio";

interface Props {
  post: ScheduledPost | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onRetry?: (id: string) => void;
  onEdit?: (post: ScheduledPost) => void;
}

/* ── Helpers ── */
const formatScheduledDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }) +
  " às " +
  d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "h";

/* ── Document type metadata (same logic from CreatePostModal) ── */
const getDocInfo = (fileName?: string, mimeType?: string) => {
  const ext = (fileName?.split(".").pop() ?? "").toLowerCase();
  const mime = (mimeType ?? "").toLowerCase();
  if (ext === "pdf" || mime.includes("pdf"))
    return { label: "PDF", color: "#E02D3C", bg: "#FFF1F2", Icon: FileText };
  if (["xls", "xlsx"].includes(ext) || mime.includes("sheet") || mime.includes("excel"))
    return { label: "XLS", color: "#16A34A", bg: "#F0FDF4", Icon: FileSpreadsheet };
  if (ext === "csv" || mime.includes("csv"))
    return { label: "CSV", color: "#0891B2", bg: "#ECFEFF", Icon: FileSpreadsheet };
  if (["doc", "docx"].includes(ext) || mime.includes("word"))
    return { label: "DOC", color: "#1D4ED8", bg: "#EFF6FF", Icon: FileText };
  if (["ppt", "pptx"].includes(ext) || mime.includes("presentation"))
    return { label: "PPT", color: "#EA580C", bg: "#FFF7ED", Icon: File };
  return { label: ext.toUpperCase() || "FILE", color: "#64748B", bg: "#F8FAFC", Icon: FileText };
};

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: ScheduledPost["status"] }) => {
  const map = {
    agendado: { label: "Agendado",  color: "#175CD3", bg: "#EFF8FF", dot: "#2E90FA" },
    postado:  { label: "Postado",   color: "#067647", bg: "#ECFDF3", dot: "#17B26A" },
    falhou:   { label: "Falhou",    color: "#B42318", bg: "#FEF3F2", dot: "#F04438" },
  };
  const s = map[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 500, color: s.color, background: s.bg,
      borderRadius: 99, padding: "2px 10px 2px 8px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

/* ── Info chip (date or error message) ── */
const InfoChip = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    fontSize: 12, fontWeight: 400, color: "#344054",
    background: "#fff", border: "1px solid #D5D7DA",
    borderRadius: 6, padding: "2px 10px",
    whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

/* ── Icon box (matches Figma "Featured icon" — 48x48, radius 10, border + shadow) ── */
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 48, height: 48, borderRadius: 10,
    border: "1px solid #D5D7DA",
    background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 1px 2px rgba(10,13,18,0.05), inset 0 -2px 0 rgba(10,13,18,0.05)",
  }}>
    {children}
  </div>
);

/* ── Outline button ── */
const OutlineBtn = ({
  onClick, icon: Icon, children, danger = false, iconColor,
}: {
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
  iconColor?: string;
}) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "8px 16px", borderRadius: 8,
      border: `1px solid ${danger ? "#FDA29B" : "#D5D7DA"}`,
      background: "#fff",
      color: danger ? "#D92D20" : "#344054",
      fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
      lineHeight: "20px",
    }}
    onMouseEnter={e => (e.currentTarget.style.background = danger ? "#FEF3F2" : "#F9FAFB")}
    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
  >
    <Icon size={15} color={iconColor ?? (danger ? "#D92D20" : "#98A2B3")} strokeWidth={2} />
    {children}
  </button>
);

/* ── Media renderer ── */
const MediaSection = ({ post }: { post: ScheduledPost }) => {
  const media = post.media;
  if (!media || media.length === 0) return null;

  const images = media.filter(m => m.type === "image");
  const videos = media.filter(m => m.type === "video");
  const audios = media.filter(m => m.type === "audio");
  const docs   = media.filter(m => m.type === "document");

  return (
    <div style={{ marginTop: 16 }}>
      {/* ── Single image ── */}
      {images.length === 1 && videos.length === 0 && audios.length === 0 && docs.length === 0 && (
        <PostMediaPhoto src={images[0].url || ""} />
      )}

      {/* ── Two images ── */}
      {images.length === 2 && videos.length === 0 && audios.length === 0 && docs.length === 0 && (
        <PostMediaTwoPhotos images={images.map(i => i.url || "")} />
      )}

      {/* ── Gallery (3+ images) ── */}
      {images.length >= 3 && videos.length === 0 && audios.length === 0 && docs.length === 0 && (
        <PostMediaGallery
          images={images.map(i => i.url || "")}
          extraCount={images.length > 4 ? images.length - 4 : undefined}
        />
      )}

      {/* ── Video ── */}
      {videos.length > 0 && (
        <PostMediaVideo
          coverUrl={videos[0].url || "/assets/post-dev-office.png"}
          duration="12:30"
        />
      )}

      {/* ── Audio ── */}
      {audios.length > 0 && (
        <PostMediaAudio
          title={audios[0].fileName || "Áudio da postagem"}
          postAuthor={post.author}
          postAvatar={post.avatar}
          postContent={post.content}
        />
      )}

      {/* ── Documents (PDF, XLS, DOC, etc.) ── */}
      {docs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {docs.map(doc => {
            const info = getDocInfo(doc.fileName, doc.mimeType);
            const DocIcon = info.Icon;
            return (
              <div
                key={doc.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  border: "1px solid #E9EAEB", borderRadius: 10,
                  background: "#FAFAFA",
                  cursor: "pointer",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#B2DDFF";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(21,112,239,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#E9EAEB";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: info.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <DocIcon size={18} color={info.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography.Text style={{
                    fontSize: 13, fontWeight: 600, color: "#101828",
                    display: "block", lineHeight: "18px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {doc.fileName || "Documento"}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 12, color: "#667085", lineHeight: "16px" }}>
                    {info.label}
                  </Typography.Text>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: info.bg,
                  fontSize: 11, fontWeight: 700, color: info.color,
                  letterSpacing: 0.5,
                }}>
                  {info.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Main component ── */
const PostDetailsModal = ({ post, onClose, onDelete, onPublish, onRetry, onEdit }: Props) => {
  if (!post) return null;

  const isAgendado = post.status === "agendado";
  const isFalhou   = post.status === "falhou";
  const isPostado  = post.status === "postado";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1400, background: "rgba(10,13,18,0.7)" }}
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1401,
          width: "min(760px, calc(100vw - 48px))",
          background: "#fff", borderRadius: 16,
          boxShadow: "0 24px 80px rgba(10,13,18,0.22)",
          border: "1px solid #E9EAEB",
          fontFamily: "Inter, sans-serif",
          maxHeight: "90vh",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <Flex align="center" justify="space-between" style={{ padding: "20px 24px", flexShrink: 0, borderBottom: "1px solid #E9EAEB" }}>
          <Typography.Text strong style={{ fontSize: 16, color: "#101828", lineHeight: "24px" }}>
            Detalhes
          </Typography.Text>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#717680", display: "flex", lineHeight: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = "#F2F4F7")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <X size={18} />
          </button>
        </Flex>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: "auto", flex: 1 }} className="thin-scrollbar">
          <div style={{ padding: "20px 24px" }}>

            {/* Author row */}
            <Flex align="center" justify="space-between" gap={12} style={{ marginBottom: 16 }}>
              <Flex align="center" gap={12} style={{ flexShrink: 0 }}>
                <Avatar src={post.avatar} size={40} style={{ flexShrink: 0 }} />
                <Typography.Text strong style={{ fontSize: 14, color: "#101828", lineHeight: "20px", whiteSpace: "nowrap" }}>
                  {post.author}
                </Typography.Text>
              </Flex>

              <Flex align="center" gap={8} style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
                {isAgendado && (
                  <InfoChip>Agendada para {formatScheduledDate(post.scheduledAt)}</InfoChip>
                )}
                {isPostado && (
                  <InfoChip>Publicada em {formatScheduledDate(post.scheduledAt)}</InfoChip>
                )}
                {isFalhou && (
                  <InfoChip>Erro de autenticação: token de acesso expirado</InfoChip>
                )}
                <StatusBadge status={post.status} />
              </Flex>
            </Flex>

            {/* Post content */}
            <Typography.Paragraph
              style={{
                fontSize: 14, color: "#344054", lineHeight: "22px",
                marginBottom: 0,
              }}
            >
              {post.content}
            </Typography.Paragraph>

            {/* ── Media section ── */}
            <MediaSection post={post} />

            {/* ── Status section ── */}
            <div style={{ margin: "24px 0 4px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6 }}>
              {/* Icon */}
              {isAgendado && (
                <IconBox>
                  <Clock size={20} color="#414651" strokeWidth={2} />
                </IconBox>
              )}
              {isFalhou && (
                <IconBox>
                  <AlertCircle size={20} color="#F04438" strokeWidth={2} />
                </IconBox>
              )}
              {isPostado && (
                <IconBox>
                  <CheckCircle2 size={20} color="#17B26A" strokeWidth={2} />
                </IconBox>
              )}

              {/* Title */}
              {isAgendado && (
                <Typography.Text strong style={{ fontSize: 14, color: "#101828", lineHeight: "20px", marginTop: 6 }}>
                  Publicação agendada
                </Typography.Text>
              )}
              {isFalhou && (
                <Typography.Text strong style={{ fontSize: 14, color: "#101828", lineHeight: "20px", marginTop: 6 }}>
                  Publicação falhou!
                </Typography.Text>
              )}
              {isPostado && (
                <Typography.Text strong style={{ fontSize: 14, color: "#101828", lineHeight: "20px", marginTop: 6 }}>
                  Publicação concluída
                </Typography.Text>
              )}

              {/* Subtitle */}
              {isAgendado && (
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>
                  As interações estarão disponíveis após a publicação.
                </Typography.Text>
              )}
              {isFalhou && (
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>
                  Corrija o erro e tente publicar novamente.
                </Typography.Text>
              )}
              {isPostado && (
                <Typography.Text style={{ fontSize: 13, color: "#667085", lineHeight: "20px" }}>
                  A publicação foi enviada com sucesso.
                </Typography.Text>
              )}

            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid #E9EAEB", padding: "16px 24px", flexShrink: 0, background: "#fff" }}>
          <Flex align="center" justify="flex-end" gap={10}>
            <OutlineBtn
              onClick={() => onDelete(post.id)}
              icon={Trash2}
              danger
            >
              Excluir
            </OutlineBtn>
            <OutlineBtn onClick={() => onEdit?.(post)} icon={Pencil}>
              Editar
            </OutlineBtn>
            {isPostado ? (
              <OutlineBtn onClick={() => {}} icon={ExternalLink} iconColor="#667085">
                Ver postagem final
              </OutlineBtn>
            ) : isFalhou ? (
              <OutlineBtn onClick={() => onRetry?.(post.id)} icon={RefreshCw} iconColor="#667085">
                Tentar novamente
              </OutlineBtn>
            ) : (
              <OutlineBtn onClick={() => onPublish(post.id)} icon={Send} iconColor="#667085">
                Publicar agora
              </OutlineBtn>
            )}
          </Flex>
        </div>
      </div>
    </>
  );
};

export default PostDetailsModal;
