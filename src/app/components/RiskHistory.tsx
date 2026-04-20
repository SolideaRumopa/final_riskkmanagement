import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { History, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const historyData = [
  {
    id: 1,
    timestamp: "2026-04-08 10:30:00",
    action: "Risk Score Updated",
    risk: "R-001 - Ketiadaan Genset",
    user: "Leader Admin",
    details: "Risk score changed from 12 to 9",
    type: "update",
  },
  {
    id: 2,
    timestamp: "2026-04-06 14:15:00",
    action: "Control Added",
    risk: "R-001 - Ketiadaan Genset",
    user: "Floor Manager",
    details: "Added control: Install Backup Generator",
    type: "create",
  },
  {
    id: 3,
    timestamp: "2026-04-05 09:20:00",
    action: "Risk Mitigated",
    risk: "R-002 - Jaringan Internet Buruk",
    user: "Leader Admin",
    details: "Status changed to Mitigated",
    type: "success",
  },
  {
    id: 4,
    timestamp: "2026-04-03 16:45:00",
    action: "New Risk Identified",
    risk: "R-003 - Single Point of Failure",
    user: "Crew Member",
    details: "Risk level: High (Score: 9)",
    type: "alert",
  },
  {
    id: 5,
    timestamp: "2026-04-01 11:00:00",
    action: "Risk Score Increased",
    risk: "R-004 - Kehilangan Data",
    user: "Floor Manager",
    details: "Risk score changed from 6 to 9",
    type: "alert",
  },
  {
    id: 6,
    timestamp: "2026-03-28 13:30:00",
    action: "Control Completed",
    risk: "R-002 - Jaringan Internet",
    user: "Leader Admin",
    details: "Network Monitoring System deployed",
    type: "success",
  },
  {
    id: 7,
    timestamp: "2026-03-25 10:15:00",
    action: "Vulnerability Added",
    risk: "Asset: Main Server",
    user: "Floor Manager",
    details: "Added: No server redundancy",
    type: "create",
  },
  {
    id: 8,
    timestamp: "2026-03-20 15:45:00",
    action: "Asset Created",
    risk: "A-005 - Kitchen Equipment",
    user: "Leader Admin",
    details: "Value: Rp 100,000,000",
    type: "create",
  },
];

export function RiskHistory() {
  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "success":
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case "update":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "update":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Risk History & Activity Log
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Track all changes and activities in the risk management system
        </p>
      </div>

      {/* Filter Options */}
      <Card className="p-4">
        <div className="flex gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Activity Types</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="alert">Alerts</option>
            <option value="success">Resolved</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Users</option>
            <option value="Leader">Leader Admin</option>
            <option value="Manager">Floor Manager</option>
            <option value="Crew">Crew Member</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>
      </Card>

      {/* History Timeline */}
      <Card className="p-6">
        <div className="space-y-4">
          {historyData.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 border rounded-lg ${getColor(
                item.type
              )}`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(item.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.action}</h3>
                    <p className="text-sm text-gray-600">{item.risk}</p>
                  </div>
                  <Badge className="bg-white text-gray-700 border border-gray-300 hover:bg-white">
                    {item.user}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.details}</p>
                <p className="text-xs text-gray-500">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
