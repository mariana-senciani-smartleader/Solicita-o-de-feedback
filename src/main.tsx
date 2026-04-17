import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 800 }}>
          <h2 style={{ color: "#D92D20" }}>Erro na aplicação</h2>
          <pre style={{ background: "#F5F5F5", padding: 16, overflow: "auto" }}>
            {this.state.error.message}
          </pre>
          <pre style={{ fontSize: 12, color: "#717680" }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById("root")!;
try {
  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (e) {
  root.innerHTML = `<div style="padding:24px;font-family:monospace"><h2 style="color:#D92D20">Erro ao carregar</h2><pre>${String(e)}</pre></div>`;
}
