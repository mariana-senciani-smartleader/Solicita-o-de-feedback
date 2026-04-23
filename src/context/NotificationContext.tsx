import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface ToastItem {
  id: string;
  message: string;
  exiting: boolean;
}

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useAppNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useAppNotification deve ser usado dentro de NotificationProvider");
  return ctx;
};

/* ── Ícone de sucesso com 3 anéis concêntricos (fiel ao design Figma) ── */
const SuccessIcon = () => (
  <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
    {/* Anel externo – 10% opacidade */}
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      border: "1.5px solid #079455", opacity: 0.1,
    }} />
    {/* Anel médio – 30% opacidade */}
    <div style={{
      position: "absolute", inset: 6, borderRadius: "50%",
      border: "1.5px solid #079455", opacity: 0.3,
    }} />
    {/* Círculo interno com checkmark */}
    <div style={{
      position: "absolute", inset: 11, borderRadius: "50%",
      border: "1.5px solid #079455",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M2 5.2L4 7.2L8.5 2.8"
          stroke="#079455"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

/* ── Card individual de notificação ── */
const Toast = ({
  message,
  exiting,
  onDismiss,
}: {
  message: string;
  exiting: boolean;
  onDismiss: () => void;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "7px 16px 7px 12px",
      background: "#ffffff",
      borderRadius: 8,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow:
        "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
      minWidth: 320,
      maxWidth: 420,
      pointerEvents: "auto",
      fontFamily: "'Inter', sans-serif",
      animation: exiting
        ? "notif-exit 0.25s ease-in forwards"
        : "notif-enter 0.3s ease-out",
    }}
  >
    <SuccessIcon />
    <span
      style={{
        flex: 1,
        fontSize: 14,
        fontWeight: 500,
        color: "#181D27",
        lineHeight: "20px",
      }}
    >
      {message}
    </span>
    <button
      onClick={onDismiss}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="#A4A7AE"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
);

/* ── Provider global ── */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      280
    );
  }, []);

  const showNotification = useCallback(
    (message: string) => {
      const id = String(Date.now() + Math.random());
      setToasts((prev) => [...prev, { id, message, exiting: false }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <style>{`
        @keyframes notif-enter {
          from { opacity: 0; transform: translateX(calc(100% + 24px)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes notif-exit {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(calc(100% + 24px)); }
        }
      `}</style>
      {children}
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            exiting={toast.exiting}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
