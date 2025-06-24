
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const Dashboard = () => {
  // Mock data - in production, this would come from your database
  const salesData = [
    { month: "Jan", sales: 45000, purchases: 25000 },
    { month: "Feb", sales: 52000, purchases: 28000 },
    { month: "Mar", sales: 48000, purchases: 30000 },
    { month: "Apr", sales: 61000, purchases: 35000 },
    { month: "May", sales: 55000, purchases: 32000 },
    { month: "Jun", sales: 67000, purchases: 38000 },
  ];

  const recentTransactions = [
    { id: "INV-001", customer: "ABC Corp", amount: 1250, type: "sale", date: "2024-06-20" },
    { id: "PUR-045", supplier: "XYZ Supplies", amount: 850, type: "purchase", date: "2024-06-19" },
    { id: "INV-002", customer: "Tech Solutions", amount: 2100, type: "sale", date: "2024-06-19" },
    { id: "PUR-046", supplier: "Global Parts", amount: 1500, type: "purchase", date: "2024-06-18" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$67,000</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$38,000</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$29,000</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              -3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#22c55e" name="Sales" />
                <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest sales and purchase activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <div className="font-medium">{transaction.id}</div>
                    <div className="text-sm text-gray-600">
                      {transaction.type === 'sale' ? transaction.customer : transaction.supplier}
                    </div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'}`}>
                      ${transaction.amount.toLocaleString()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      transaction.type === 'sale' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
