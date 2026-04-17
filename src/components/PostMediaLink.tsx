import { ExternalLink } from "lucide-react";

interface PostMediaLinkProps {
  title: string;
  domain: string;
  image?: string;
  url?: string;
}

const PostMediaLink = ({
  title = "Artigo Externo – Confira o conteúdo completo",
  domain = "blog.example.com",
  image = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=400&fit=crop",
  url = "#",
}: PostMediaLinkProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none", display: "block", marginBottom: 16 }}
  >
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #E9EAEB",
        overflow: "hidden",
        background: "#fff",
        cursor: "pointer",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
        el.style.borderColor = "#B2DDFF";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.borderColor = "#E9EAEB";
      }}
    >
      {/* Imagem de destaque */}
      {image && (
        <div style={{ height: 180, overflow: "hidden" }}>
          <img
            src={image}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Info do link */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          {/* Domínio */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4, background: "#F2F4F7",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <ExternalLink size={10} color="#667085" />
            </div>
            <span style={{ fontSize: 12, color: "#667085", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {domain}
            </span>
          </div>

          {/* Título */}
          <p style={{
            margin: 0, fontSize: 14, fontWeight: 600, color: "#101828",
            lineHeight: "20px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {title}
          </p>
        </div>

        {/* Ícone de link externo */}
        <div style={{
          flexShrink: 0, width: 32, height: 32, borderRadius: 8,
          background: "#F9FAFB", border: "1px solid #E9EAEB",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ExternalLink size={14} color="#667085" />
        </div>
      </div>
    </div>
  </a>
);

export default PostMediaLink;
