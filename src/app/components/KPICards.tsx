import { AlertTriangle, TrendingUp, Shield, Target } from "lucide-react";
import { Card } from "./ui/card";

// Mock data - in real app, this would come from state management or API
const kpiData = [
  {
    title: "Total Risks",
    value: "24",
    icon: Target,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    change: "4 new this week",
    changeColor: "text-gray-600",
  },
  {
    title: "High Risks",
    value: "6",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    change: "Immediate action required",
    changeColor: "text-red-600",
  },
  {
    title: "Medium Risks",
    value: "11",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    change: "Monitor closely",
    changeColor: "text-yellow-600",
  },
  {
    title: "Low Risks",
    value: "7",
    icon: Shield,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    change: "Under control",
    changeColor: "text-green-600",
  },
];

export function KPICards() {
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
