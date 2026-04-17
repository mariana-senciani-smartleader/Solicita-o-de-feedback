import { AlertTriangle } from "lucide-react";
import { Button, Flex, Typography } from "antd";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ open, title, description, confirmLabel = "Delete", onCancel, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(10,13,18,0.7)",
        }}
      />

      {/* Dialog */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2001,
        width: 400,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(16,24,40,0.14)",
        overflow: "hidden",
      }}>
        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <Flex align="flex-start" gap={14}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "#FEF3F2", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <AlertTriangle size={20} color="#D92D20" strokeWidth={2} />
            </div>
            <div>
              <Typography.Text strong style={{ fontSize: 15, color: "#101828", display: "block", marginBottom: 4 }}>
                {title}
              </Typography.Text>
              <Typography.Text style={{ fontSize: 14, color: "#475467", lineHeight: "20px" }}>
                {description}
              </Typography.Text>
            </div>
          </Flex>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #E9EAEB", padding: "14px 24px" }}>
          <Flex gap={10}>
            <Button
              block
              onClick={onCancel}
              style={{
                height: 40, borderRadius: 8, fontWeight: 600,
                color: "#344054", borderColor: "#D0D5DD", fontSize: 14,
              }}
            >
              Cancel
            </Button>
            <Button
              block
              danger
              type="primary"
              onClick={onConfirm}
              style={{
                height: 40, borderRadius: 8, fontWeight: 600,
                background: "#D92D20", borderColor: "#D92D20", fontSize: 14,
              }}
            >
              {confirmLabel}
            </Button>
          </Flex>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
