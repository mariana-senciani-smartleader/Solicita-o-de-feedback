import { ArrowRight, CalendarDays, MessageSquareText } from "lucide-react";
import { Flex, Typography } from "antd";

const PesquisaCard = () => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E9EAEB",
    overflow: "hidden",
    marginBottom: 16,
    boxShadow: "0 1px 2px rgba(10,13,18,0.05)",
    display: "flex",
    minHeight: 160,
  }}>
    {/* Left: illustration area */}
    <div style={{
      width: 220,
      flexShrink: 0,
      background: "#D1D5DB",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
        alt="Pesquisa organizacional"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Badge */}
      <div style={{
        position: "absolute",
        top: 12, left: 12,
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 99, padding: "4px 10px",
        fontSize: 12, fontWeight: 600, color: "#344054",
        backdropFilter: "blur(4px)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}>
        <MessageSquareText size={13} color="#535862" />
        Pesquisa 01/03
      </div>
    </div>

    {/* Right: content */}
    <Flex vertical justify="center" style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
      <Flex align="center" gap={6} style={{ marginBottom: 8 }}>
        <CalendarDays size={14} color="#1570EF" />
        <Typography.Text style={{ fontSize: 13, color: "#1570EF", fontWeight: 500 }}>
          Disponível até 20/02/2024
        </Typography.Text>
      </Flex>

      <Typography.Title level={4} style={{ margin: "0 0 8px", fontWeight: 600, color: "#101828", fontSize: 18, lineHeight: "26px" }}>
        Pesquisa de Clima e Engajamento 2026
      </Typography.Title>

      <Typography.Text style={{ fontSize: 13, color: "#535862", lineHeight: "20px", marginBottom: 16, display: "block" }}>
        É hora de compartilhar! Envolva-se na pesquisa e seja um agente de transformação na nossa jornada organizacional. Juntos, estamos construindo não apenas respostas, mas uma narrativa coletiva.
      </Typography.Text>

      <div>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: 8,
          background: "#1570EF", border: "none",
          color: "#fff", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Iniciar pesquisa <ArrowRight size={16} />
        </button>
      </div>
    </Flex>
  </div>
);

export default PesquisaCard;
