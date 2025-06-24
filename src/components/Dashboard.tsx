
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp, Users, CreditCard } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Customer } from "./CustomerManager";
import { Payment } from "./PaymentManager";

interface DashboardProps {
  customers: Customer[];
  payments: Payment[];
}

const Dashboard = ({ customers, payments }: DashboardProps) => {
  // Mock data - in production, this would come from your database
  const salesData = [
    { month: "Jan", sales: 450000, purchases: 250000 },
    { month: "Feb", sales: 520000, purchases: 280000 },
    { month: "Mar", sales: 480000, purchases: 300000 },
    { month: "Apr", sales: 610000, purchases: 350000 },
    { month: "May", sales: 550000, purchases: 320000 },
    { month: "Jun", sales: 670000, purchases: 380000 },
  ];

  const recentTransactions = [
    { id: "INV-001", customer: customers[0]?.name || "ABC Corp", amount: 125000, type: "sale", date: "2024-06-20" },
    { id: "PUR-045", supplier: "XYZ Supplies", amount: 85000, type: "purchase", date: "2024-06-19" },
    { id: "INV-002", customer: customers[1]?.name || "Tech Solutions", amount: 210000, type: "sale", date: "2024-06-19" },
    { id: "PUR-046", supplier: "Global Parts", amount: 150000, type: "purchase", date: "2024-06-18" },
  ];

  // Calculate totals
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.outstandingBalance, 0);
  const totalPaymentsThisMonth = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCustomers = customers.length;

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
            <div className="text-2xl font-bold text-green-600">₹6,70,000</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {customers.filter(c => c.outstandingBalance > 0).length} customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{totalPaymentsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active customers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months (₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, ""]} />
                <Bar dataKey="sales" fill="#22c55e" name="Sales" />
                <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Outstanding Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Outstanding Balances</CardTitle>
            <CardDescription>Customers with pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customers
                .filter(customer => customer.outstandingBalance > 0)
                .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
                .map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-600">{customer.id}</div>
                    <div className="text-xs text-gray-500">Total Purchases: ₹{customer.totalPurchases.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      ₹{customer.outstandingBalance.toLocaleString()}
                    </div>
                    <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      Outstanding
                    </div>
                  </div>
                </div>
              ))}
              {customers.filter(customer => customer.outstandingBalance > 0).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No outstanding balances!</p>
                  <p className="text-sm">All customers are up to date with payments.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
