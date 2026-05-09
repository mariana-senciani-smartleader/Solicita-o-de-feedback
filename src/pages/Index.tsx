import { useState } from "react";
import { Layout } from "antd";
import TopNavbar from "@/components/TopNavbar";
import IconSidebar from "@/components/IconSidebar";
import MainContent, { type StarterPoint } from "@/components/MainContent";

const Index = () => {
  const [starter, setStarter] = useState<StarterPoint>("agenda");
  const sidebarActive = starter === "one-on-one" ? "Equipe" : "Início";

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Layout.Header style={{ padding: 0, display: "flex", alignItems: "center" }}>
        <TopNavbar />
      </Layout.Header>

      <Layout hasSider style={{ flex: 1, overflow: "hidden" }}>
        <Layout.Sider
          width={70}
          theme="light"
          style={{ overflow: "hidden", borderRight: "1px solid #E9EAEB", flexShrink: 0 }}
        >
          <IconSidebar activeLabel={sidebarActive} />
        </Layout.Sider>

        <Layout.Content
          style={{ display: "flex", overflow: "hidden", background: "#F5F5F5" }}
        >
          <MainContent starter={starter} setStarter={setStarter} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Index;
