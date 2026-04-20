import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// Mock data
const initialAssets = [
  { id: "A-001", name: "Power System", value: "Rp 50,000,000", category: "Infrastructure", status: "Active" },
  { id: "A-002", name: "Main Server", value: "Rp 75,000,000", category: "IT", status: "Active" },
  { id: "A-003", name: "POS System", value: "Rp 25,000,000", category: "IT", status: "Active" },
  { id: "A-004", name: "Network Infrastructure", value: "Rp 30,000,000", category: "IT", status: "Active" },
  { id: "A-005", name: "Kitchen Equipment", value: "Rp 100,000,000", category: "Operations", status: "Active" },
];

export function AssetManagement() {
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Asset Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all organizational assets and their values
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Asset
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
              placeholder="Search assets by name or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </Card>

      {/* Assets Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Asset ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1e3a8a]">
                    {asset.id}
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.value}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {asset.status}
                    </span>
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

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Asset
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Value (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Enter asset value"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
                  <option value="">Select category</option>
                  <option value="IT">IT</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
                  Save Asset
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
