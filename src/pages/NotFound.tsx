import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button, Flex, Typography } from "antd";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: "100vh", background: "#F5F5F5" }}
    >
      <Flex vertical align="center" gap={16}>
        <Typography.Title level={1} style={{ margin: 0 }}>404</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 18 }}>
          Página não encontrada
        </Typography.Text>
        <Button type="primary" href="/">Voltar ao início</Button>
      </Flex>
    </Flex>
  );
};

export default NotFound;
