import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Target } from "lucide-react";
import { Card } from "./ui/card";

export function KPICards() {
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    newThisWeek: 0
  });

  useEffect(() => {
    const loadData = () => {
      // 1. UBAH KEY: Mengambil data aktual dari RiskManagement
      const savedRisks = localStorage.getItem("richeese_risk_management_data");
      const risks = savedRisks ? JSON.parse(savedRisks) : [];

      // 2. PERBAIKAN LOGIKA: Sesuaikan dengan skala 3x3 (1-9)
      const high = risks.filter((r: any) => (r.likelihood * r.impact) >= 6).length;
      const medium = risks.filter((r: any) => {
        const s = r.likelihood * r.impact;
        return s >= 3 && s < 6;
      }).length;
      const low = risks.filter((r: any) => (r.likelihood * r.impact) <= 2).length;

      setStats({
        total: risks.length,
        high: high,
        medium: medium,
        low: low,
        newThisWeek: 0 
      });
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const kpiData = [
    {
      title: "Total Risks",
      value: stats.total.toString(),
      icon: Target,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      change: stats.total > 0 ? "Overall risk" : "No risks recorded",
      changeColor: "text-gray-600",
    },
    {
      title: "High Risks",
      value: stats.high.toString(),
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      change: stats.high > 0 ? "Urgent action required" : "No high risks",
      changeColor: stats.high > 0 ? "text-red-600" : "text-gray-500",
    },
    {
      title: "Medium Risks",
      value: stats.medium.toString(),
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: stats.medium > 0 ? "Needs attention" : "No medium risks",
      changeColor: stats.medium > 0 ? "text-yellow-600" : "text-gray-500",
    },
    {
      title: "Low Risks",
      value: stats.low.toString(),
      icon: Shield,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      change: stats.low > 0 ? "No major disruption" : "No low risks",
      changeColor: stats.low > 0 ? "text-green-600" : "text-gray-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                <p className="text-3xl font-semibold text-gray-900 mb-2">
                  {kpi.value}
                </p>
                <p className={`text-xs ${kpi.changeColor}`}>{kpi.change}</p>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
