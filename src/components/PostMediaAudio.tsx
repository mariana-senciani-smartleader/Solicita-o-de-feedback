import { Expand, Headphones, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AudioViewerModal from "./AudioViewerModal";

interface PostMediaAudioProps {
  title?: string;
  duration?: string;
  postAuthor?: string;
  postAvatar?: string;
  postTime?: string;
  postContent?: string;
}

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

const PostMediaAudio = ({
  title = "Jotaerre Audio",
  postAuthor = "", postAvatar = "", postTime = "", postContent = "",
}: PostMediaAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const activeBars = Math.floor((progress / 100) * waveformBars.length);

  return (
    <>
      <audio ref={audioRef} />
      <div style={{ marginBottom: 16, borderRadius: 12, background: "#1a1a2e", padding: 24, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "rgba(255,255,255,0.9)" }}>{title}</p>
          <button
            onClick={() => setModalOpen(true)}
            title="Abrir em tela cheia"
            style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 12 }}
          >
            <Expand size={14} /> Expandir
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Headphones size={32} color="rgba(255,255,255,0.7)" />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: 48, marginBottom: 20 }}>
          {waveformBars.map((h, i) => (
            <div key={i} style={{ width: 3, borderRadius: 9999, background: i < activeBars ? "#7B61FF" : "rgba(255,255,255,0.25)", height: `${h}%`, transition: "background 0.1s" }} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SkipBack size={16} color="rgba(255,255,255,0.6)" style={{ cursor: "pointer" }} onClick={() => skip(-10)} />
          <div onClick={togglePlay} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.15)"}
          >
            {playing ? <Pause size={16} color="#fff" fill="#fff" /> : <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />}
          </div>
          <SkipForward size={16} color="rgba(255,255,255,0.6)" style={{ cursor: "pointer" }} onClick={() => skip(10)} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", minWidth: 36 }}>{fmt(currentTime)}</span>
          <div ref={progressRef} onClick={seek} style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 9999, cursor: "pointer" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#7B61FF", borderRadius: 9999, transition: "width 0.1s" }} />
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", minWidth: 36, textAlign: "right" }}>{duration ? fmt(duration) : "00:00"}</span>
          <div onClick={() => { setMuted(v => !v); if (audioRef.current) audioRef.current.muted = !muted; }} style={{ cursor: "pointer" }}>
            {muted ? <VolumeX size={16} color="rgba(255,255,255,0.6)" /> : <Volume2 size={16} color="rgba(255,255,255,0.6)" />}
          </div>
        </div>
      </div>

      <AudioViewerModal
        open={modalOpen}
        title={title}
        postAuthor={postAuthor}
        postAvatar={postAvatar}
        postTime={postTime}
        postContent={postContent}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PostMediaAudio;
