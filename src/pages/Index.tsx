import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart3, 
  Search,
  Plus,
  Eye,
  Download,
  Users,
  CreditCard,
  Box
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import SalesManager from "@/components/SalesManager";
import PurchaseManager from "@/components/PurchaseManager";
import InventoryManager from "@/components/InventoryManager";
import BillGenerator from "@/components/BillGenerator";
import ReportsManager from "@/components/ReportsManager";
import CustomerManager, { Customer } from "@/components/CustomerManager";
import PaymentManager, { Payment } from "@/components/PaymentManager";
import ProductManager, { Product } from "@/components/ProductManager";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Enhanced state management for customers and payments
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-001",
      name: "ABC Corporation",
      email: "contact@abc.com",
      phone: "+91 9876543210",
      address: "123 Business Street, Mumbai",
      totalPurchases: 125000,
      outstandingBalance: 15000,
      createdAt: "2024-06-01"
    },
    {
      id: "CUST-002",
      name: "Tech Solutions Ltd",
      email: "info@techsolutions.com",
      phone: "+91 9876543211",
      address: "456 Tech Park, Bangalore",
      totalPurchases: 89000,
      outstandingBalance: 0,
      createdAt: "2024-06-05"
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      customerId: "CUST-001",
      customerName: "ABC Corporation",
      invoiceId: "INV-001",
      amount: 10000,
      paymentMethod: "upi",
      date: "2024-06-20",
      notes: "Partial payment for order #123"
    }
  ]);

  // Add products state management
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PROD-001",
      name: "Premium Rice",
      size: "25kg",
      rate: 1500
    },
    {
      id: "PROD-002",
      name: "Wheat Flour",
      size: "10kg",
      rate: 450
    },
    {
      id: "PROD-003",
      name: "Cooking Oil",
      size: "5L",
      rate: 650
    },
    {
      id: "PROD-004",
      name: "Sugar",
      size: "1kg",
      rate: 45
    },
    {
      id: "PROD-005",
      name: "Tea Leaves",
      size: "500g",
      rate: 280
    }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in production, this would connect to your authentication system
    if (loginForm.username === "admin" && loginForm.password === "admin") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Try username: admin, password: admin");
    }
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers([customer, ...customers]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const handleAddPayment = (payment: Payment) => {
    setPayments([payment, ...payments]);
    
    // Update customer's outstanding balance
    setCustomers(customers.map(customer => {
      if (customer.id === payment.customerId) {
        return {
          ...customer,
          outstandingBalance: Math.max(0, customer.outstandingBalance - payment.amount)
        };
      }
      return customer;
    }));
  };

  const handleAddProduct = (product: Product) => {
    setProducts([product, ...products]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Business Manager</CardTitle>
            <CardDescription>Sign in to access your business dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
              <p className="text-sm text-gray-600 text-center mt-4">
                Demo: username: <strong>admin</strong>, password: <strong>admin</strong>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Business Manager</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsLoggedIn(false)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Purchases</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Bills</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard customers={customers} payments={payments} />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManager 
              customers={customers} 
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
            />
          </TabsContent>

          <TabsContent value="sales">
            <SalesManager 
              customers={customers} 
              products={products}
              onUpdateCustomer={handleUpdateCustomer} 
            />
          </TabsContent>

          <TabsContent value="purchases">
            <PurchaseManager products={products} />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManager 
              payments={payments}
              customers={customers}
              onAddPayment={handleAddPayment}
            />
          </TabsContent>

          <TabsContent value="bills">
            <BillGenerator />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
