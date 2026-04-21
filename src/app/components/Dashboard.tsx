import { useState, useEffect } from "react";
import { KPICards } from "./KPICards";
import { RiskMatrix3x3 } from "./RiskMatrix3x3";
import { TopRisksTable } from "./TopRisksTable";
import { RiskDetailPanel } from "./RiskDetailPanel";
import { NotificationAlert } from "./NotificationAlert";

export function Dashboard() {
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  
  const [showNotification, setShowNotification] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedStatus = sessionStorage.getItem("richeese_dashboard_notif_dismissed");
      return savedStatus === "true" ? false : false; // Default false, akan di-trigger useEffect
    }
    return false;
  });

  useEffect(() => {
    const checkSystemsIntegration = () => {
      // Ambil data aktual dari Risk Management
      const risks = JSON.parse(localStorage.getItem("richeese_risk_management_data") || "[]");
      
      // Jika ada risiko High (Score >= 6 pada skala 3x3)
      const criticalRisks = risks.filter((r: any) => (Number(r.likelihood) * Number(r.impact)) >= 6);
      const isDismissed = sessionStorage.getItem("richeese_dashboard_notif_dismissed");

      if (criticalRisks.length > 0 && isDismissed !== "true") {
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    };

    checkSystemsIntegration();
    window.addEventListener('storage', checkSystemsIntegration);
    return () => window.removeEventListener('storage', checkSystemsIntegration);
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
    sessionStorage.setItem("richeese_dashboard_notif_dismissed", "true");
  };

  const handleRiskSelection = (risk: any) => {
    setSelectedRisk(risk);
    if (window.innerWidth < 768) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {showNotification && (
        <NotificationAlert onClose={handleCloseNotification} />
      )}

      {/* Komponen-komponen ini sekarang akan membaca data sendiri */}
      <KPICards />
      <RiskMatrix3x3 onRiskSelect={handleRiskSelection} />
      <TopRisksTable onRiskSelect={handleRiskSelection} />

      {selectedRisk && (
        <RiskDetailPanel
          risk={selectedRisk}
          onClose={() => setSelectedRisk(null)}
        />
      )}
    </div>
  );
}
