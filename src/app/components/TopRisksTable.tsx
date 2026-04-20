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

const topRisks = [
  {
    id: "R-001",
    name: "Ketiadaan Genset Cadangan",
    asset: "Power System",
    vulnerability: "No backup power",
    threat: "Power outage >4 hours",
    category: "Power",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "High",
    status: "In Progress",
  },
  {
    id: "R-003",
    name: "Single Point of Failure - Server",
    asset: "Main Server",
    vulnerability: "No redundancy",
    threat: "Server crash",
    category: "Network",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "High",
    status: "Not Started",
  },
  {
    id: "R-004",
    name: "Kehilangan Data Transaksi",
    asset: "POS System",
    vulnerability: "No real-time backup",
    threat: "Data loss",
    category: "Data Loss",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "High",
    status: "In Progress",
  },
  {
    id: "R-002",
    name: "Jaringan Internet Buruk",
    asset: "Network Infrastructure",
    vulnerability: "Single ISP, weak signal",
    threat: "Connection loss",
    category: "Network",
    likelihood: 3,
    impact: 2,
    score: 6,
    level: "Medium",
    status: "Mitigated",
  },
  {
    id: "R-006",
    name: "Staff Training Gap",
    asset: "Human Resources",
    vulnerability: "Inadequate training",
    threat: "Operational errors",
    category: "Human Error",
    likelihood: 2,
    impact: 3,
    score: 6,
    level: "Medium",
    status: "In Progress",
  },
];

interface TopRisksTableProps {
  onRiskSelect: (risk: any) => void;
}

export function TopRisksTable({ onRiskSelect }: TopRisksTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Top Critical Risks
          </h2>
          <p className="text-sm text-gray-600">
            Prioritized risks requiring immediate attention
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
              <TableHead className="font-semibold">Risk Name</TableHead>
              <TableHead className="font-semibold">Asset</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">L × I</TableHead>
              <TableHead className="font-semibold">Risk Score</TableHead>
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topRisks.map((risk) => (
              <TableRow key={risk.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-[#1e3a8a]">
                  {risk.id}
                </TableCell>
                <TableCell className="font-medium">{risk.name}</TableCell>
                <TableCell>{risk.asset}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {risk.likelihood} × {risk.impact}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      risk.level === "High"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-yellow-600 text-white hover:bg-yellow-700"
                    }`}
                  >
                    {risk.score}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`border-0 ${
                      risk.level === "High"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }`}
                  >
                    {risk.level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`border-0 ${
                      risk.status === "Mitigated"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : risk.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }`}
                  >
                    {risk.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100"
                    onClick={() => onRiskSelect(risk)}
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
