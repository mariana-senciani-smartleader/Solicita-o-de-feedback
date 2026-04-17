import { App as AntApp, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const dsTheme = {
  token: {
    /* ── Primary (brand-600) ── */
    colorPrimary: "#1570EF",

    /* ── Semantic ── */
    colorError:   "#D92D20",
    colorSuccess: "#079455",
    colorWarning: "#DC6803",
    colorInfo:    "#1570EF",

    /* ── Typography ── */
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,

    /* ── Border radius ── */
    borderRadius:   8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
    borderRadiusXS: 4,

    /* ── Text colors (gray scale) ── */
    colorText:            "#181D27",   // gray-900
    colorTextSecondary:   "#535862",   // gray-600
    colorTextTertiary:    "#717680",   // gray-500
    colorTextQuaternary:  "#A4A7AE",   // gray-400

    /* ── Background colors ── */
    colorBgContainer:  "#FFFFFF",
    colorBgLayout:     "#F5F5F5",      // gray-100
    colorBgElevated:   "#FFFFFF",
    colorFillAlter:    "#FAFAFA",      // gray-50
    colorFillSecondary:"#F5F5F5",      // gray-100

    /* ── Border colors ── */
    colorBorder:          "#E9EAEB",   // gray-200
    colorBorderSecondary: "#D5D7DA",   // gray-300

    /* ── Control sizing ── */
    controlHeight:   38,
    controlHeightSM: 30,
    controlHeightLG: 44,

    /* ── Motion ── */
    motionDurationMid: "0.15s",
    motionDurationSlow: "0.2s",
  },

  components: {
    Layout: {
      headerBg:     "#101828",
      siderBg:      "#FFFFFF",
      bodyBg:       "#F5F5F5",
      headerHeight: 66,
      headerPadding:"0 24px",
    },
    Button: {
      borderRadius:   10,
      fontWeight:     600,
      primaryShadow:  "none",
      defaultShadow:  "none",
      dangerShadow:   "none",
    },
    Input: {
      borderRadius:  10,
      activeShadow:  "none",
      paddingBlock:  7,
      paddingInline: 12,
    },
    Modal: {
      borderRadiusLG: 16,
      paddingMD:      24,
    },
    Card: {
      borderRadius: 16,
      paddingLG:    20,
    },
    Drawer: {
      borderRadius: 0,
    },
    Tabs: {
      itemColor:         "#717680",
      itemSelectedColor: "#1570EF",
      inkBarColor:       "#1570EF",
      itemHoverColor:    "#175CD3",
    },
    Dropdown: {
      borderRadius:    10,
      borderRadiusLG:  12,
      paddingBlock:    10,
    },
    Select: {
      borderRadius:   10,
    },
    Switch: {
      colorPrimary: "#1570EF",
    },
    Badge: {
      colorBgContainer: "#FEF3F2",
    },
    Notification: {
      borderRadius:    12,
      paddingMD:       16,
    },
  },
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider locale={ptBR} theme={dsTheme}>
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/"  element={<Index />} />
            <Route path="*"  element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
