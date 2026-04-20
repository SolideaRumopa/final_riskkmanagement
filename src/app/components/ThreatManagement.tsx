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

const initialThreats = [
  { id: "T-001", name: "Power outage >4 hours", vulnerability: "No backup power source", category: "Power", probability: "High" },
  { id: "T-002", name: "Server crash", vulnerability: "No server redundancy", category: "Network", probability: "High" },
  { id: "T-003", name: "Data loss", vulnerability: "No real-time backup", category: "Data Loss", probability: "High" },
  { id: "T-004", name: "Internet connection loss", vulnerability: "Single ISP dependency", category: "Network", probability: "Medium" },
  { id: "T-005", name: "Operational errors", vulnerability: "Inadequate staff training", category: "Human Error", probability: "Medium" },
  { id: "T-006", name: "Cyber attack", vulnerability: "Outdated security patches", category: "Security", probability: "High" },
];

export function ThreatManagement() {
  const [threats, setThreats] = useState(initialThreats);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredThreats = threats.filter((threat) =>
    threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    threat.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Threat Catalog
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage potential threats and their relationships to vulnerabilities
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Threat
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
              placeholder="Search threats by name or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Categories</option>
            <option value="Power">Power</option>
            <option value="Network">Network</option>
            <option value="Human Error">Human Error</option>
            <option value="Security">Security</option>
            <option value="Data Loss">Data Loss</option>
          </select>
        </div>
      </Card>

      {/* Threats Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Threat ID</TableHead>
                <TableHead className="font-semibold">Threat Name</TableHead>
                <TableHead className="font-semibold">Related Vulnerability</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Probability</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThreats.map((threat) => (
                <TableRow key={threat.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1e3a8a]">
                    {threat.id}
                  </TableCell>
                  <TableCell className="font-medium">{threat.name}</TableCell>
                  <TableCell>{threat.vulnerability}</TableCell>
                  <TableCell>{threat.category}</TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 ${
                        threat.probability === "High"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : threat.probability === "Medium"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }`}
                    >
                      {threat.probability}
                    </Badge>
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

      {/* Add Threat Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Threat
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threat Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Enter threat name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Vulnerability *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select vulnerability</option>
                  <option value="No backup power source">No backup power source</option>
                  <option value="No server redundancy">No server redundancy</option>
                  <option value="No real-time backup">No real-time backup</option>
                  <option value="Single ISP dependency">Single ISP dependency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select category</option>
                  <option value="Power">Power</option>
                  <option value="Network">Network</option>
                  <option value="Human Error">Human Error</option>
                  <option value="Security">Security</option>
                  <option value="Data Loss">Data Loss</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probability *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select probability</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
                  Save Threat
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
