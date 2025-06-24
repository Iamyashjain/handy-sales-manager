
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, AlertTriangle } from "lucide-react";

const InventoryManager = () => {
  const [inventory, setInventory] = useState([
    {
      id: "ITM-001",
      name: "Product A",
      category: "Electronics",
      currentStock: 45,
      minStock: 10,
      unitPrice: 100,
      totalValue: 4500,
      lastUpdated: "2024-06-20"
    },
    {
      id: "ITM-002",
      name: "Product B",
      category: "Electronics",
      currentStock: 23,
      minStock: 15,
      unitPrice: 250,
      totalValue: 5750,
      lastUpdated: "2024-06-19"
    },
    {
      id: "ITM-003",
      name: "Raw Material A",
      category: "Materials",
      currentStock: 150,
      minStock: 50,
      unitPrice: 15,
      totalValue: 2250,
      lastUpdated: "2024-06-20"
    },
    {
      id: "ITM-004",
      name: "Component B",
      category: "Components",
      currentStock: 75,
      minStock: 25,
      unitPrice: 25,
      totalValue: 1875,
      lastUpdated: "2024-06-20"
    },
    {
      id: "ITM-005",
      name: "Product C",
      category: "Electronics",
      currentStock: 8,
      minStock: 20,
      unitPrice: 150,
      totalValue: 1200,
      lastUpdated: "2024-06-18"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", ...new Set(inventory.map(item => item.category))];
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock <= minStock) {
      return { status: "low", color: "destructive" };
    } else if (currentStock <= minStock * 1.5) {
      return { status: "medium", color: "secondary" };
    } else {
      return { status: "good", color: "default" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Monitor stock levels and inventory value</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Different products
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.currentStock, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Units in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalInventoryValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total worth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-700">
              The following items are running low and need restocking:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-red-600">
                    {item.currentStock} units (Min: {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>All items currently in stock</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Stock</th>
                  <th className="text-right p-2">Min Stock</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Total Value</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.currentStock, item.minStock);
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">{item.id}</td>
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-gray-600">{item.category}</td>
                      <td className="p-2 text-right font-medium">{item.currentStock}</td>
                      <td className="p-2 text-right text-gray-600">{item.minStock}</td>
                      <td className="p-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-2 text-right font-medium text-green-600">
                        ${item.totalValue.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={stockStatus.color as any}>
                          {stockStatus.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
