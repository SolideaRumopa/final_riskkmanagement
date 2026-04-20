import { Eye } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const criticalRisks = [
  {
    id: "RISK-2024-001",
    asset: "Student Database",
    vulnerability: "Outdated Patch Level",
    threat: "SQL Injection",
    score: 25,
    status: "In Progress",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "RISK-2024-002",
    asset: "Authentication System",
    vulnerability: "Weak Password Policy",
    threat: "Brute Force Attack",
    score: 24,
    status: "Not Started",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: "RISK-2024-003",
    asset: "Grade Management Module",
    vulnerability: "Missing Authorization Check",
    threat: "Privilege Escalation",
    score: 23,
    status: "In Progress",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "RISK-2024-004",
    asset: "File Storage Server",
    vulnerability: "Unencrypted Backup",
    threat: "Data Breach",
    score: 22,
    status: "Mitigated",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "RISK-2024-005",
    asset: "API Gateway",
    vulnerability: "Rate Limiting Disabled",
    threat: "DDoS Attack",
    score: 20,
    status: "In Progress",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
];

export function CriticalRisksTable() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Top Critical Risks
          </h2>
          <p className="text-sm text-gray-600">
            Highest priority risks requiring immediate attention
          </p>
        </div>
        <Button variant="outline" className="text-[#1e3a8a] border-[#1e3a8a]">
          View All Risks
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Risk ID</TableHead>
              <TableHead className="font-semibold">Asset</TableHead>
              <TableHead className="font-semibold">Vulnerability</TableHead>
              <TableHead className="font-semibold">Threat</TableHead>
              <TableHead className="font-semibold">Risk Score</TableHead>
              <TableHead className="font-semibold">Control Status</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalRisks.map((risk) => (
              <TableRow key={risk.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-[#1e3a8a]">
                  {risk.id}
                </TableCell>
                <TableCell>{risk.asset}</TableCell>
                <TableCell>{risk.vulnerability}</TableCell>
                <TableCell>{risk.threat}</TableCell>
                <TableCell>
                  <Badge className="bg-red-600 text-white hover:bg-red-700">
                    {risk.score}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${risk.statusColor} border-0 hover:${risk.statusColor}`}
                  >
                    {risk.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
