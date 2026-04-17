import { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Typography } from "antd";
import { ArrowRight, Headphones, MessageSquare, Pause, Play, Share2, SkipBack, SkipForward, ThumbsUp, Volume2, VolumeX, X } from "lucide-react";
import { avatar } from "@/lib/avatar";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

const MOCK_COMMENTS: Comment[] = [
  { id: "a1", author: "Ana Costa",        avatar: avatar("Ana Costa"),        time: "45 minutos atrás", text: "Excelente conteúdo, muito útil!",         likes: 18 },
  { id: "a2", author: "Carlos Mendes",    avatar: avatar("Carlos Mendes"),    time: "32 minutos atrás", text: "Adorei o episódio, parabéns!",            likes: 12 },
  { id: "a3", author: "Mariana Oliveira", avatar: avatar("Mariana Oliveira"), time: "20 minutos atrás", text: "Vou compartilhar com o time todo!",       likes: 9  },
  { id: "a4", author: "Pedro Alves",      avatar: avatar("Pedro Alves"),      time: "10 minutos atrás", text: "Que produção incrível, continuem!",       likes: 7  },
];

const waveformBars = [
  20, 35, 50, 30, 65, 45, 70, 40, 55, 75, 35, 60, 45, 80, 50, 35, 65, 40, 55, 30,
  70, 45, 60, 35, 50, 75, 40, 55, 65, 30, 45, 70, 50, 60, 35, 80, 45, 55, 40, 65,
  50, 30, 70, 55, 45, 35, 60, 75, 40, 50,
];

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

interface AudioViewerModalProps {
  open: boolean;
  title?: string;
  bannerUrl?: string;
  postAuthor: string;
  postAvatar: string;
  postTime: string;
  postContent: string;
  isNew?: boolean;
  onClose: () => void;
}

const AudioViewerModal = ({
  open, title = "Áudio", bannerUrl,
  postAuthor, postAvatar, postTime, postContent, isNew,
  onClose,
}: AudioViewerModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  useEffect(() => {
    if (!open) { audioRef.current?.pause(); setPlaying(false); }
  }, [open]);

  if (!open) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const skip = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + secs));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{
      id: String(Date.now()), author: "Bruno Delorence",
      avatar: avatar("Bruno Delorence"), time: "Agora",
      text: commentText.trim(), likes: 0,
    }, ...prev]);
    setCommentText("");
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const activeBars = Math.floor((progress / 100) * waveformBars.length);
  const truncated = postContent.length > 200 ? postContent.slice(0, 200).trimEnd() + "..." : postContent;

  return (
    <>
      <audio ref={audioRef} />
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.88)" }} />

      <div style={{ position: "fixed", inset: 0, zIndex: 2001, display: "flex" }}>
        {/* ── Left: Audio Player ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 48 }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
            <X size={20} color="#fff" />
          </button>

          {/* Banner or icon */}
          {bannerUrl ? (
            <div style={{ width: "100%", maxWidth: 560, borderRadius: 20, overflow: "hidden", marginBottom: 32, position: "relative" }}>
              <img src={bannerUrl} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))" }} />
              <div style={{ position: "absolute", bottom: 16, left: 20 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{title}</p>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", backdropFilter: "blur(8px)" }}>
                <Headphones size={48} color="rgba(255,255,255,0.8)" />
              </div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>{title}</p>
            </div>
          )}

          {/* Player card */}
          <div style={{ width: "100%", maxWidth: 560, background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px 28px", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Waveform */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 64, marginBottom: 24 }}>
              {waveformBars.map((h, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 9999, background: i < activeBars ? "#7B61FF" : "rgba(255,255,255,0.2)", height: `${h}%`, transition: "background 0.1s" }} />
              ))}
            </div>

            {/* Progress bar */}
            <div ref={progressRef} onClick={seek} style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 9999, cursor: "pointer", marginBottom: 8 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#7B61FF", borderRadius: 9999, transition: "width 0.1s" }} />
            </div>
            <Flex justify="space-between" style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{fmt(currentTime)}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{duration ? fmt(duration) : "00:00"}</span>
            </Flex>

            {/* Controls */}
            <Flex align="center" justify="center" gap={20}>
              <button onClick={() => skip(-10)} style={ctrlBtn}><SkipBack size={20} color="rgba(255,255,255,0.7)" /></button>
              <button onClick={togglePlay} style={{ ...ctrlBtn, width: 56, height: 56, background: "#7B61FF", borderRadius: "50%" }}>
                {playing ? <Pause size={22} color="#fff" fill="#fff" /> : <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />}
              </button>
              <button onClick={() => skip(10)} style={ctrlBtn}><SkipForward size={20} color="rgba(255,255,255,0.7)" /></button>
              <button onClick={() => { setMuted(v => !v); if (audioRef.current) audioRef.current.muted = !muted; }} style={ctrlBtn}>
                {muted ? <VolumeX size={18} color="rgba(255,255,255,0.7)" /> : <Volume2 size={18} color="rgba(255,255,255,0.7)" />}
              </button>
            </Flex>
          </div>
        </div>

        {/* ── Right: Post + Comments sidebar ── */}
        <div onClick={e => e.stopPropagation()} style={{ width: 420, background: "#fff", display: "flex", flexDirection: "column", borderLeft: "1px solid #E9EAEB", overflow: "hidden" }}>
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

          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Typography.Text style={{ fontSize: 13, color: "#344054", lineHeight: "20px" }}>{truncated}</Typography.Text>
          </div>

          <Flex align="center" justify="space-between" style={{ padding: "8px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Flex gap={4}>
              <button style={actionBtnStyle}><ThumbsUp size={15} /> Curtir</button>
              <button style={actionBtnStyle}><MessageSquare size={15} /> Comentar</button>
              <button style={actionBtnStyle}><Share2 size={15} /> Compartilhar</button>
            </Flex>
          </Flex>

          <Flex align="center" gap={8} style={{ padding: "12px 20px", borderBottom: "1px solid #F2F4F7", flexShrink: 0 }}>
            <Avatar src={avatar("Bruno Delorence")} size={32} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid #D0D5DD", borderRadius: 20, padding: "4px 4px 4px 14px", gap: 6 }}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
                placeholder="Adicione um comentário..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#344054", fontFamily: "inherit", background: "transparent" }}
              />
              <button onClick={handleAddComment} disabled={!commentText.trim()} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: commentText.trim() ? "pointer" : "default", background: commentText.trim() ? "#1570EF" : "#E9EAEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ArrowRight size={14} color={commentText.trim() ? "#fff" : "#A4A7AE"} />
              </button>
            </div>
          </Flex>

          <Flex align="center" justify="space-between" style={{ padding: "10px 20px 6px", flexShrink: 0 }}>
            <Flex align="center" gap={6}>
              <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>Comentários</Typography.Text>
              <span style={{ fontSize: 11, fontWeight: 600, background: "#EFF8FF", color: "#1570EF", borderRadius: 99, padding: "1px 7px" }}>{comments.length}</span>
            </Flex>
          </Flex>

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }} className="thin-scrollbar">
            {comments.map(c => (
              <Flex key={c.id} gap={10} style={{ padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
                <Avatar src={c.avatar} size={32} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap={6}>
                    <Typography.Text strong style={{ fontSize: 13, color: "#101828" }}>{c.author}</Typography.Text>
                    <Typography.Text style={{ fontSize: 11, color: "#A4A7AE" }}>{c.time}</Typography.Text>
                  </Flex>
                  <Typography.Text style={{ fontSize: 13, color: "#344054", display: "block", marginTop: 2 }}>{c.text}</Typography.Text>
                  <Flex align="center" gap={12} style={{ marginTop: 6 }}>
                    <Flex align="center" gap={4} style={{ cursor: "pointer" }}><ThumbsUp size={12} color="#667085" /><span style={{ fontSize: 12, color: "#667085" }}>{c.likes}</span></Flex>
                    <Flex align="center" gap={4} style={{ cursor: "pointer" }}><MessageSquare size={12} color="#667085" /><span style={{ fontSize: 12, color: "#667085" }}>Responder</span></Flex>
                  </Flex>
                </div>
              </Flex>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const ctrlBtn: React.CSSProperties = {
  width: 44, height: 44, borderRadius: "50%", border: "none",
  background: "rgba(255,255,255,0.1)", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  backdropFilter: "blur(4px)",
};

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 5, background: "none", border: "none",
  cursor: "pointer", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500,
  color: "#535862", fontFamily: "inherit",
};

export default AudioViewerModal;
