import { useState } from "react";

interface PostMediaGalleryProps {
  images: string[];
  extraCount?: number;
}

const PostMediaGallery = ({ images, extraCount }: PostMediaGalleryProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayImages = images.slice(1, 4);
  const remaining = extraCount ?? Math.max(0, images.length - 4);

  return (
    <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Main image – 16:9 */}
      <div
        style={{
          borderRadius: 10,
          overflow: "hidden",
          aspectRatio: "16/9",
          cursor: "pointer",
          position: "relative",
        }}
        onMouseEnter={() => setHovered(0)}
        onMouseLeave={() => setHovered(null)}
      >
        <img
          src={images[0]}
          alt="Gallery main"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered === 0 ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />
      </div>

      {/* Thumbnail row */}
      {displayImages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {displayImages.map((src, i) => {
            const isLast = i === displayImages.length - 1 && remaining > 0;
            const idx = i + 1;
            return (
              <div
                key={i}
                style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <img
                  src={src}
                  alt={`Gallery ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: 110,
                    objectFit: "cover",
                    display: "block",
                    transform: hovered === idx ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.35s ease",
                  }}
                />
                {isLast && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.52)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                      +{remaining}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                      fotos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostMediaGallery;
