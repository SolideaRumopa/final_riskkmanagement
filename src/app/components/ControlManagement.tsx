import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const initialControls = [
  {
    id: "C-001",
    name: "Install Backup Generator",
    type: "Preventive",
    relatedRisk: "R-001 - Ketiadaan Genset",
    priority: "High",
    status: "In Progress",
    progress: 60,
  },
  {
    id: "C-002",
    name: "Implement Server Redundancy",
    type: "Preventive",
    relatedRisk: "R-003 - Server Failure",
    priority: "High",
    status: "Pending",
    progress: 0,
  },
  {
    id: "C-003",
    name: "Real-time Data Backup System",
    type: "Preventive",
    relatedRisk: "R-004 - Data Loss",
    priority: "High",
    status: "In Progress",
    progress: 45,
  },
  {
    id: "C-004",
    name: "Network Monitoring System",
    type: "Detective",
    relatedRisk: "R-002 - Network Issues",
    priority: "Medium",
    status: "Completed",
    progress: 100,
  },
  {
    id: "C-005",
    name: "Staff Training Program",
    type: "Corrective",
    relatedRisk: "R-006 - Training Gap",
    priority: "Medium",
    status: "In Progress",
    progress: 75,
  },
];

export function ControlManagement() {
  const [controls, setControls] = useState(initialControls);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredControls = controls.filter((control) =>
    control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Control Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Define and track mitigation controls for identified risks
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Control
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search controls..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Detective">Detective</option>
            <option value="Corrective">Corrective</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </Card>

      {/* Controls Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Control ID</TableHead>
                <TableHead className="font-semibold">Control Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Related Risk</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.map((control) => (
                <TableRow key={control.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1e3a8a]">
                    {control.id}
                  </TableCell>
                  <TableCell className="font-medium">{control.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
                      {control.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{control.relatedRisk}</TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${
                        control.priority === "High"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }`}
                    >
                      {control.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${
                        control.status === "Completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : control.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {control.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            control.progress === 100
                              ? "bg-green-500"
                              : control.progress > 50
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${control.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {control.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Control Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Control
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Enter control name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Type *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Detective">Detective</option>
                  <option value="Corrective">Corrective</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Preventive: Prevents risk | Detective: Detects risk | Corrective: Fixes risk
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Risk *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select risk</option>
                  <option value="R-001">R-001 - Ketiadaan Genset Cadangan</option>
                  <option value="R-002">R-002 - Jaringan Internet Buruk</option>
                  <option value="R-003">R-003 - Single Point of Failure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
                  Save Control
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
