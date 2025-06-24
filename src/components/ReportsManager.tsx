
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Pie, PieChart, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportsManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  
  // Mock data for reports
  const salesData = [
    { month: "Jan", sales: 45000, purchases: 25000, profit: 20000 },
    { month: "Feb", sales: 52000, purchases: 28000, profit: 24000 },
    { month: "Mar", sales: 48000, purchases: 30000, profit: 18000 },
    { month: "Apr", sales: 61000, purchases: 35000, profit: 26000 },
    { month: "May", sales: 55000, purchases: 32000, profit: 23000 },
    { month: "Jun", sales: 67000, purchases: 38000, profit: 29000 },
  ];

  const categoryData = [
    { name: "Electronics", value: 45, color: "#3b82f6" },
    { name: "Materials", value: 30, color: "#10b981" },
    { name: "Components", value: 15, color: "#f59e0b" },
    { name: "Others", value: 10, color: "#ef4444" }
  ];

  const topProducts = [
    { name: "Product A", sold: 150, revenue: 15000, trend: "up" },
    { name: "Product B", sold: 120, revenue: 30000, trend: "up" },
    { name: "Product C", sold: 95, revenue: 14250, trend: "down" },
    { name: "Electronic Parts", sold: 80, revenue: 6400, trend: "up" },
    { name: "Raw Materials", sold: 75, revenue: 1125, trend: "down" }
  ];

  const monthlyStats = {
    totalSales: 67000,
    totalPurchases: 38000,
    grossProfit: 29000,
    netProfit: 25000,
    salesGrowth: 12.5,
    profitMargin: 43.3
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive business insights and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Sales
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${monthlyStats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">
              +{monthlyStats.salesGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Gross Profit
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${monthlyStats.grossProfit.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">
              {monthlyStats.profitMargin}% margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Purchases
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${monthlyStats.totalPurchases.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">
              Material costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Net Profit
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${monthlyStats.netProfit.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1">
              After expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales & Purchase Trends</CardTitle>
            <CardDescription>Monthly comparison over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, ""]} />
                <Bar dataKey="sales" fill="#22c55e" name="Sales" />
                <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
            <CardDescription>Monthly profit analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Profit"]} />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.sold} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${product.revenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={product.trend === "up" ? "default" : "secondary"}>
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Download className="h-6 w-6" />
              <span>Sales Report CSV</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Download className="h-6 w-6" />
              <span>Purchase Report CSV</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Download className="h-6 w-6" />
              <span>Inventory Report CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManager;
