import { useState, useRef, useEffect } from "react";
import { Avatar, Flex, Typography } from "antd";
import {
  ArrowRight, ChevronLeft, ChevronRight, MessageSquare, MoreHorizontal, Pencil, Share2,
  ThumbsUp, Trash2, X,
} from "lucide-react";
import { avatar } from "@/lib/avatar";

const ME = "Bruno Delorence";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface ImageViewerModalProps {
  open: boolean;
  images: string[];
  initialIndex?: number;
  postAuthor: string;
  postAvatar: string;
  postTime: string;
  postContent: string;
  isNew?: boolean;
  onClose: () => void;
}

const MOCK_COMMENTS: Comment[] = [
  { id: "v1", author: "Joan Pierre",      avatar: avatar("Joan Pierre"),      time: "58 minutos atrás", text: "Ela merece todo reconhecimento!",        likes: 25 },
  { id: "v2", author: "Carlos Mendes",    avatar: avatar("Carlos Mendes"),    time: "34 minutos atrás", text: "Incrível trabalho, parabéns!",           likes: 15 },
  { id: "v3", author: "Ana Costa",        avatar: avatar("Ana Costa"),        time: "30 minutos atrás", text: "Muito inspirador, continue assim!",      likes: 30 },
  { id: "v4", author: "Pedro Alves",      avatar: avatar("Pedro Alves"),      time: "15 minutos atrás", text: "Adorei a iniciativa, vamos em frente!",  likes: 22 },
  { id: "v5", author: "Fernanda Lima",    avatar: avatar("Fernanda Lima"),    time: "10 minutos atrás", text: "Esse projeto é um divisor de águas!",    likes: 18 },
  { id: "v6", author: "Rafael Souza",     avatar: avatar("Rafael Souza"),     time: "5 minutos atrás",  text: "Resultado surpreendente, show!",         likes: 12 },
];

const CommentItem = ({
  c,
  onDelete,
  onEdit,
}: {
  c: Comment;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) => {
  const isOwn = c.author === ME;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(c.text);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const saveEdit = () => {
    if (editText.trim()) { onEdit(c.id, editText.trim()); }
    setEditing(false);
  };

  return (
    <Flex gap={10} style={{ padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
      <Avatar src={c.avatar} size={32} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={6}>
            <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>{c.author}</Typography.Text>
            <Typography.Text style={{ fontSize: 11, color: "#A4A7AE" }}>{c.time}</Typography.Text>
          </Flex>
          {isOwn && (
            <div style={{ position: "relative" }} ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 4, display: "flex", color: "#98A2B3" }}
              >
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", zIndex: 10, background: "#fff", border: "1px solid #E9EAEB", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 140, overflow: "hidden" }}>
                  <button
                    onClick={() => { setEditing(true); setEditText(c.text); setMenuOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#344054", fontFamily: "inherit" }}
                  >
                    <Pencil size={14} color="#667085" /> Editar
                  </button>
                  <button
                    onClick={() => { onDelete(c.id); setMenuOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#D92D20", fontFamily: "inherit" }}
                  >
                    <Trash2 size={14} color="#D92D20" /> Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </Flex>

        {editing ? (
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, border: "1px solid #1570EF", borderRadius: 8, padding: "4px 4px 4px 10px" }}>
            <input
              autoFocus
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#344054", fontFamily: "inherit", background: "transparent" }}
            />
            <button onClick={saveEdit} style={{ background: "#1570EF", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#fff", fontFamily: "inherit" }}>Salvar</button>
            <button onClick={() => setEditing(false)} style={{ background: "none", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 12, color: "#667085", fontFamily: "inherit" }}>Cancelar</button>
          </div>
        ) : (
          <Typography.Text style={{ fontSize: 13, color: "#344054", display: "block", marginTop: 2 }}>{c.text}</Typography.Text>
        )}

        <Flex align="center" gap={12} style={{ marginTop: 6 }}>
          <Flex align="center" gap={4} style={{ cursor: "pointer" }}><ThumbsUp size={12} color="#667085" /><span style={{ fontSize: 12, color: "#667085" }}>{c.likes}</span></Flex>
          <Flex align="center" gap={4} style={{ cursor: "pointer" }}><MessageSquare size={12} color="#667085" /><span style={{ fontSize: 12, color: "#667085" }}>Responder</span></Flex>
        </Flex>
      </div>
    </Flex>
  );
};

const ImageViewerModal = ({
  open, images, initialIndex = 0,
  postAuthor, postAvatar, postTime, postContent, isNew,
  onClose,
}: ImageViewerModalProps) => {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  if (!open) return null;

  const hasMultiple = images.length > 1;
  const goPrev = () => setCurrentIdx(i => (i - 1 + images.length) % images.length);
  const goNext = () => setCurrentIdx(i => (i + 1) % images.length);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{
      id: String(Date.now()), author: ME,
      avatar: avatar(ME), time: "Agora",
      text: commentText.trim(), likes: 0,
    }, ...prev]);
    setCommentText("");
  };

  const handleDelete = (id: string) => setComments(prev => prev.filter(c => c.id !== id));
  const handleEdit = (id: string, text: string) => setComments(prev => prev.map(c => c.id === id ? { ...c, text } : c));

  const truncated = postContent.length > 200 ? postContent.slice(0, 200).trimEnd() + "..." : postContent;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)" }} />

      <div style={{ position: "fixed", inset: 0, zIndex: 2001, display: "flex" }}>
        {/* ── Left: Image ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minWidth: 0 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", zIndex: 10 }}>
            <X size={20} color="#fff" />
          </button>

          {hasMultiple && (
            <button onClick={goPrev} style={{ position: "absolute", left: 24, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", zIndex: 10 }}>
              <ChevronLeft size={22} color="#fff" />
            </button>
          )}

          <img
            src={images[currentIdx]}
            alt=""
            style={{ maxWidth: "85%", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }}
            onClick={e => e.stopPropagation()}
          />

          {hasMultiple && (
            <button onClick={goNext} style={{ position: "absolute", right: 24, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", zIndex: 10 }}>
              <ChevronRight size={22} color="#fff" />
            </button>
          )}

          {hasMultiple && (
            <Flex gap={8} style={{ position: "absolute", bottom: 20, backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.35)", borderRadius: 12, padding: "8px 10px" }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  style={{
                    width: 78, height: 56, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", overflow: "hidden", flexShrink: 0,
                    outline: i === currentIdx ? "2px solid #1570EF" : "2px solid transparent",
                    outlineOffset: 2,
                    opacity: i === currentIdx ? 1 : 0.55,
                    transition: "opacity 0.2s, outline 0.2s",
                  }}
                >
                  <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </Flex>
          )}
        </div>

        {/* ── Right: Post + Comments sidebar ── */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: 420, background: "#fff", display: "flex", flexDirection: "column", borderLeft: "1px solid #E9EAEB", overflow: "hidden" }}
        >
          {/* Author header */}
          <Flex align="center" justify="space-between" style={{ padding: "16px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Flex align="center" gap={10}>
              <Avatar src={postAvatar} size={40} />
              <div>
                <Flex align="center" gap={6}>
                  <Typography.Text strong style={{ fontSize: 14, color: "#101828" }}>{postAuthor}</Typography.Text>
                  {isNew && <span style={{ fontSize: 10, fontWeight: 700, color: "#175CD3", background: "#EFF8FF", border: "1px solid #B2DDFF", padding: "1px 6px", borderRadius: 12 }}>NOVO</span>}
                </Flex>
                <Typography.Text style={{ fontSize: 12, color: "#667085", display: "block" }}>{postTime}</Typography.Text>
              </div>
            </Flex>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}>
              <X size={16} color="#98A2B3" />
            </button>
          </Flex>

          {/* Post content */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Typography.Text style={{ fontSize: 13, color: "#344054", lineHeight: "20px" }}>{truncated}</Typography.Text>
          </div>

          {/* Reactions bar */}
          <Flex align="center" justify="space-between" style={{ padding: "8px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Flex gap={4}>
              <button style={actionBtnStyle}><ThumbsUp size={15} /> Curtir</button>
              <button style={actionBtnStyle}><MessageSquare size={15} /> Comentar</button>
              <button style={actionBtnStyle}><Share2 size={15} /> Compartilhar</button>
            </Flex>
          </Flex>

          {/* Reaction stats */}
          <Flex align="center" justify="space-between" style={{ padding: "8px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Flex align="center" gap={4}>
              <div style={{ display: "flex" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", zIndex: 2 }}>
                  <ThumbsUp size={9} color="#fff" fill="#fff" />
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F7B125", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: -6, zIndex: 1 }}>
                  <span style={{ fontSize: 9 }}>😆</span>
                </div>
              </div>
              <span style={{ fontSize: 12, color: "#535862" }}>127</span>
            </Flex>
            <Flex gap={10}>
              <span style={{ fontSize: 12, color: "#535862" }}>62 comentários</span>
              <span style={{ fontSize: 12, color: "#535862" }}>7 compartilhamentos</span>
            </Flex>
          </Flex>

          {/* Comment input */}
          <Flex align="center" gap={8} style={{ padding: "12px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Avatar src={avatar(ME)} size={32} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #D0D5DD", borderRadius: 20, padding: "4px 4px 4px 14px", gap: 6 }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
                placeholder="Adicione um comentário..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#344054", fontFamily: "inherit", background: "transparent" }}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: commentText.trim() ? "pointer" : "default", background: commentText.trim() ? "#1570EF" : "#E9EAEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}
              >
                <ArrowRight size={14} color={commentText.trim() ? "#fff" : "#A4A7AE"} />
              </button>
            </div>
          </Flex>

          {/* Comments header */}
          <Flex align="center" justify="space-between" style={{ padding: "10px 20px 6px", flexShrink: 0 }}>
            <Flex align="center" gap={6}>
              <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>Comentários</Typography.Text>
              <span style={{ fontSize: 11, fontWeight: 600, background: "#EFF8FF", color: "#1570EF", borderRadius: 99, padding: "1px 7px" }}>{comments.length}</span>
            </Flex>
            <Typography.Text style={{ fontSize: 12, color: "#667085", cursor: "pointer" }}>Mais recentes</Typography.Text>
          </Flex>

          {/* Comments list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }} className="thin-scrollbar">
            {comments.map(c => (
              <CommentItem key={c.id} c={c} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 5, background: "none", border: "none",
  cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500,
  color: "#535862", fontFamily: "inherit",
};

export default ImageViewerModal;
