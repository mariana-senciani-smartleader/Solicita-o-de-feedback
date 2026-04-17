import { Flex, Modal, Typography } from "antd";
import { Globe, X } from "lucide-react";

interface ChannelInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChannelInfoModal = ({ open, onOpenChange }: ChannelInfoModalProps) => (
  <Modal
    open={open}
    onCancel={() => onOpenChange(false)}
    footer={null}
    width={800}
    closeIcon={<X size={20} color="#667085" />}
    styles={{
      body: { padding: 0 }
    }}
    centered
  >
    {/* Header */}
    <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #EAECF0" }}>
      <Flex align="flex-start" gap={16}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#1570EF", flexShrink: 0
        }}>
          <Globe size={24} color="#fff" />
        </div>
        <div>
          <Typography.Title level={4} style={{ margin: "0 0 4px", fontWeight: 600, color: "#101828", fontSize: 18 }}>
            Geral
          </Typography.Title>
          <Typography.Text style={{ fontSize: 14, color: "#475467" }}>
            Confira abaixo as informações e direcionamentos deste canal.
          </Typography.Text>
        </div>
      </Flex>
    </div>

    {/* Body */}
    <div style={{ padding: "24px", maxHeight: "80vh", overflowY: "auto" }} className="thin-scrollbar">
      <Typography.Paragraph style={{ fontSize: 14, color: "#344054", marginBottom: 24 }}>
        <span role="img" aria-label="flag">🏳️</span> <strong>Bem-vindos ao Canal Geral!</strong>
      </Typography.Paragraph>

      <Typography.Paragraph style={{ fontSize: 14, color: "#344054", marginBottom: 24, lineHeight: "20px" }}>
        Este é o nosso espaço oficial para comunicados importantes, novidades da empresa e alinhamento geral. Para mantermos o fluxo de trabalho organizado, seguimos algumas diretrizes:
      </Typography.Paragraph>

      {/* Section 1 */}
      <div style={{ marginBottom: 24 }}>
        <Typography.Text strong style={{ fontSize: 14, color: "#344054", display: "block", marginBottom: 12 }}>
          <span role="img" aria-label="target">🎯</span> O que discutimos aqui:
        </Typography.Text>
        <ul style={{ paddingLeft: 20, margin: 0, color: "#475467", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong>Comunicados Oficiais:</strong> Notícias e atualizações da empresa.</li>
          <li><strong>Eventos e Celebrações:</strong> Informações sobre datas comemorativas e eventos internos.</li>
          <li><strong>Novidades:</strong> Lançamentos, parcerias e conquistas.</li>
          <li><strong>Avisos Gerais:</strong> Informações sobre feriados, manutenção predial, etc.</li>
        </ul>
      </div>

      {/* Section 2 */}
      <div style={{ marginBottom: 24 }}>
        <Typography.Text strong style={{ fontSize: 14, color: "#344054", display: "block", marginBottom: 12 }}>
          <span role="img" aria-label="stop">🚫</span> O que não é permitido:
        </Typography.Text>
        <ul style={{ paddingLeft: 20, margin: 0, color: "#475467", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong>Spam ou Correntes:</strong> Evite mensagens que não agregam valor ao trabalho.</li>
          <li><strong>Assuntos Polêmicos:</strong> Discussões políticas, religiosas ou ofensivas.</li>
          <li><strong>Vendas Pessoais:</strong> Comércio de produtos ou serviços particulares.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div>
        <Typography.Text strong style={{ fontSize: 14, color: "#344054", display: "block", marginBottom: 12 }}>
          <span role="img" aria-label="balance">⚖️</span> Regras de Ouro:
        </Typography.Text>
        <ol style={{ paddingLeft: 20, margin: 0, color: "#475467", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong>Respeito acima de tudo:</strong> Mantenha a cordialidade e o profissionalismo.</li>
          <li><strong>Objetividade:</strong> Seja claro e direto nas suas mensagens.</li>
          <li><strong>Engajamento positivo:</strong> Contribua para um ambiente saudável e colaborativo.</li>
        </ol>
      </div>
    </div>
  </Modal>
);

export default ChannelInfoModal;
