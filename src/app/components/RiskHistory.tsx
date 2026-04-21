import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { History, TrendingUp, TrendingDown, AlertTriangle, UserCheck } from "lucide-react";

interface HistoryItem {
  id: string;
  action: string;
  risk: string;
  details: string;
  type: "update" | "alert" | "success" | "default" | "login";
  user: string;
  timestamp: string;
}

const TYPE_CONFIG = {
  alert: { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, color: "bg-red-50 border-red-200" },
  success: { icon: <TrendingDown className="w-5 h-5 text-green-600" />, color: "bg-green-50 border-green-200" },
  update: { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, color: "bg-blue-50 border-blue-200" },
  login: { icon: <UserCheck className="w-5 h-5 text-purple-600" />, color: "bg-purple-50 border-purple-200" },
  default: { icon: <History className="w-5 h-5 text-gray-600" />, color: "bg-gray-50 border-gray-200" },
};

export function RiskHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const loadData = () => {
    try {
      const getData = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
      setHistoryItems(getData("richeese_risk_history"));
      setAvailableUsers(getData("system_users"));
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  useEffect(() => {
    loadData();
    // Mendengarkan perubahan storage baik dari tab lain maupun event manual dari tab yang sama
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const filteredHistory = useMemo(() => {
    return historyItems
      .filter(item => {
        const matchUser = !filterUser || item.user === filterUser;
        const matchDate = !filterDate || item.timestamp?.startsWith(filterDate);
        return matchUser && matchDate;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [historyItems, filterUser, filterDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        <p className="text-sm text-gray-600 mt-1">Track all activities</p>
      </div>

      <Card className="p-4 shadow-sm border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Filter User</label>
            <select 
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm bg-white min-w-[200px]"
            >
              <option value="">All Users</option>
              {availableUsers.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Filter Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm bg-white"
            />
          </div>

          {(filterUser || filterDate) && (
            <button onClick={() => { setFilterUser(""); setFilterDate(""); }} className="mt-5 text-xs text-[#1e3a8a] font-bold hover:underline">
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      <Card className="p-6 shadow-sm border-gray-200">
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
              const config = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.default;
              return (
                <div key={item.id} className={`flex gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${config.color}`}>
                  <div className="flex-shrink-0 mt-1">{config.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.action}</h3>
                        <p className="text-sm text-gray-600 font-medium">{item.risk}</p>
                      </div>
                      <Badge className="bg-white/80 text-gray-700 border border-gray-300">{item.user}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">{item.details}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      {new Date(item.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="italic font-medium">No activity logs found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
