import { createBrowserRouter } from "react-router";
import { UserManagement } from "./components/UserManagement";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./components/LoginPage";
import { AssetManagement } from "./components/AssetManagement";
import { VulnerabilityManagement } from "./components/VulnerabilityManagement";
import { ThreatManagement } from "./components/ThreatManagement";
import { RiskManagement } from "./components/RiskManagement";
import { ControlManagement } from "./components/ControlManagement";
import { Reports } from "./components/Reports";
import { RiskHistory } from "./components/RiskHistory";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: UserManagement },
      { path: "assets", Component: AssetManagement },
      { path: "vulnerabilities", Component: VulnerabilityManagement },
      { path: "threats", Component: ThreatManagement },
      { path: "risks", Component: RiskManagement },
      { path: "controls", Component: ControlManagement },
      { path: "reports", Component: Reports },
      { path: "history", Component: RiskHistory },
    ],
  },
]);
