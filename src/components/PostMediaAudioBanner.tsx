import { Expand, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AudioViewerModal from "./AudioViewerModal";

interface PostMediaAudioBannerProps {
  bannerUrl?: string;
  title?: string;
  duration?: string;
  postAuthor?: string;
  postAvatar?: string;
  postTime?: string;
  postContent?: string;
}

const waveformBars = [
  18, 32, 48, 28, 60, 42, 68, 38, 52, 72, 33, 56, 43, 76, 48, 33, 62, 38, 52, 28,
  66, 43, 58, 33, 48, 72, 38, 52, 62, 28, 43, 68, 48, 58, 33, 76, 43, 53, 38, 62,
  48, 28, 66, 52, 43, 33, 58, 72, 38, 48,
];

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const PostMediaAudioBanner = ({
  bannerUrl = "/assets/post-dev-office.png",
  title = "Podcast Corporativo – Ep. 12",
  postAuthor = "", postAvatar = "", postTime = "", postContent = "",
}: PostMediaAudioBannerProps) => {
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
      <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "1px solid #E9EAEB" }}>
        {/* Banner */}
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          <img src={bannerUrl} alt="Audio banner" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: "22px", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{title}</p>
            <button
              onClick={() => setModalOpen(true)}
              title="Abrir em tela cheia"
              style={{ background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)", fontSize: 12, backdropFilter: "blur(4px)" }}
            >
              <Expand size={13} /> Expandir
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: "#1C1C2E", padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2, height: 40, marginBottom: 12 }}>
            {waveformBars.map((h, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 9999, background: i < activeBars ? "#7B61FF" : "rgba(255,255,255,0.2)", height: `${h}%`, transition: "background 0.1s" }} />
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
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", minWidth: 36, marginLeft: 4 }}>{fmt(currentTime)}</span>
            <div ref={progressRef} onClick={seek} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 9999, cursor: "pointer" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#7B61FF", borderRadius: 9999, transition: "width 0.1s" }} />
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", minWidth: 36, textAlign: "right" }}>{duration ? fmt(duration) : "00:00"}</span>
            <div onClick={() => { setMuted(v => !v); if (audioRef.current) audioRef.current.muted = !muted; }} style={{ cursor: "pointer", marginLeft: 4 }}>
              {muted ? <VolumeX size={16} color="rgba(255,255,255,0.6)" /> : <Volume2 size={16} color="rgba(255,255,255,0.6)" />}
            </div>
          </div>
        </div>
      </div>

      <AudioViewerModal
        open={modalOpen}
        title={title}
        bannerUrl={bannerUrl}
        postAuthor={postAuthor}
        postAvatar={postAvatar}
        postTime={postTime}
        postContent={postContent}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PostMediaAudioBanner;
