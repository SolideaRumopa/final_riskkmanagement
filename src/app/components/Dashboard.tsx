import { useState } from "react";
import { KPICards } from "./KPICards";
import { RiskMatrix3x3 } from "./RiskMatrix3x3";
import { TopRisksTable } from "./TopRisksTable";
import { RiskDetailPanel } from "./RiskDetailPanel";
import { NotificationAlert } from "./NotificationAlert";

export function Dashboard() {
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="space-y-6">
      {/* High Risk Notification */}
      {showNotification && (
        <NotificationAlert onClose={() => setShowNotification(false)} />
      )}

      {/* KPI Cards */}
      <KPICards />

      {/* Risk Matrix */}
      <RiskMatrix3x3 onRiskSelect={setSelectedRisk} />

      {/* Top Risks Table */}
      <TopRisksTable onRiskSelect={setSelectedRisk} />

      {/* Risk Detail Panel */}
      {selectedRisk && (
        <RiskDetailPanel
          risk={selectedRisk}
          onClose={() => setSelectedRisk(null)}
        />
      )}
    </div>
  );
}
