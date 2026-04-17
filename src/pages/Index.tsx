import { Layout } from "antd";
import TopNavbar from "@/components/TopNavbar";
import IconSidebar from "@/components/IconSidebar";
import MainContent from "@/components/MainContent";

const Index = () => (
  <Layout style={{ height: "100vh", overflow: "hidden" }}>
    {/* Top header – background comes from ConfigProvider Layout.headerBg */}
    <Layout.Header style={{ padding: 0, display: "flex", alignItems: "center" }}>
      <TopNavbar />
    </Layout.Header>

    {/* Body row */}
    <Layout hasSider style={{ flex: 1, overflow: "hidden" }}>
      <Layout.Sider
        width={70}
        theme="light"
        style={{ overflow: "hidden", borderRight: "1px solid #E9EAEB", flexShrink: 0 }}
      >
        <IconSidebar />
      </Layout.Sider>

      <Layout.Content
        style={{ display: "flex", overflow: "hidden", background: "#F5F5F5" }}
      >
        <MainContent />
      </Layout.Content>
    </Layout>
  </Layout>
);

export default Index;
