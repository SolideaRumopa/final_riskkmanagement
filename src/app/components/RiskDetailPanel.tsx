import { X, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface RiskDetailPanelProps {
  risk: any;
  onClose: () => void;
}

export function RiskDetailPanel({ risk, onClose }: RiskDetailPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
      <Card className="w-full max-w-2xl h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Risk Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Risk Overview */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[#1e3a8a]">
                    {risk.id}
                  </span>
                  <Badge
                    className={`border-0 ${
                      risk.level === "High"
                        ? "bg-red-100 text-red-800"
                        : risk.level === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {risk.level}
                  </Badge>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {risk.name}
                </h3>
                <p className="text-sm text-gray-600">Category: {risk.category}</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Likelihood</p>
                <p className="text-3xl font-bold text-gray-900">{risk.likelihood || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Impact</p>
                <p className="text-3xl font-bold text-gray-900">{risk.impact || "N/A"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                <p
                  className={`text-3xl font-bold ${
                    risk.level === "High"
                      ? "text-red-600"
                      : risk.level === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {risk.score}
                </p>
              </div>
            </div>
          </div>

          {/* Asset Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Asset & Vulnerability</h4>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Asset</p>
                <p className="font-medium text-gray-900">{risk.asset || "Not specified"}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Vulnerability</p>
                <p className="font-medium text-gray-900">
                  {risk.vulnerability || "Not specified"}
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Threat</p>
                <p className="font-medium text-gray-900">{risk.threat || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Mitigation Controls */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Mitigation Controls</h4>
            </div>
            <div className="space-y-3">
              {risk.level === "High" && (
                <>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        Install Backup Generator
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Type: Preventive | Priority: High
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        Regular Maintenance Schedule
                      </p>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Type: Preventive | Priority: Medium
                    </p>
                  </div>
                </>
              )}
              {risk.level === "Medium" && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      Implement Monitoring System
                    </p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Completed
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Type: Detective | Priority: Medium
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Risk History */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Recent Activity</h4>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Risk score updated
                  </p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Control added: Backup Generator
                  </p>
                  <p className="text-xs text-gray-600">5 days ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Risk identified</p>
                  <p className="text-xs text-gray-600">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
              Update Risk
            </Button>
            <Button variant="outline" className="flex-1">
              Add Control
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
