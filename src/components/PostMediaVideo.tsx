import { useState } from "react";
import { Maximize2, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface PostMediaVideoProps {
  coverUrl: string;
  duration?: string;
}

const PostMediaVideo = ({ coverUrl, duration = "12:30" }: PostMediaVideoProps) => {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        marginBottom: 16,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0A0A0F",
        aspectRatio: "16/9",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <img
        src={coverUrl}
        alt="Video cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: playing ? 0.6 : 0.85,
          transform: hovered ? "scale(1.02)" : "scale(1)",
          transition: "opacity 0.3s, transform 0.4s ease",
        }}
      />

      {/* Centre play/pause button */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setPlaying((v) => !v)}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.35)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            transition: "transform 0.15s, background 0.2s",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          {playing
            ? <Pause size={24} color="#fff" fill="#fff" />
            : <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
          }
        </div>
      </div>

      {/* Bottom gradient + controls */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          padding: "28px 16px 12px",
          opacity: hovered || playing ? 1 : 0.7,
          transition: "opacity 0.3s",
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.25)",
            borderRadius: 9999,
            marginBottom: 10,
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div style={{ width: "0%", height: "100%", background: "#fff", borderRadius: 9999, position: "relative" }}>
            <div style={{
              position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
              width: 10, height: 10, borderRadius: "50%", background: "#fff",
              boxShadow: "0 0 4px rgba(0,0,0,0.4)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }} />
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            <SkipBack size={14} color="rgba(255,255,255,0.75)" />
          </button>
          <button
            onClick={() => setPlaying((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            {playing
              ? <Pause size={14} color="#fff" fill="#fff" />
              : <Play size={14} color="#fff" fill="#fff" />
            }
          </button>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            <SkipForward size={14} color="rgba(255,255,255,0.75)" />
          </button>

          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "monospace", minWidth: 36 }}>
            00:00
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "monospace", minWidth: 36, textAlign: "right" }}>
            {duration}
          </span>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            <Volume2 size={14} color="rgba(255,255,255,0.75)" />
          </button>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
          >
            <Maximize2 size={13} color="rgba(255,255,255,0.75)" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostMediaVideo;
