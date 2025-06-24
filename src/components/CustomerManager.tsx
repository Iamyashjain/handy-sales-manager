
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  outstandingBalance: number;
  createdAt: string;
}

interface CustomerManagerProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
}

const CustomerManager = ({ customers, onAddCustomer, onUpdateCustomer }: CustomerManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const createCustomer = () => {
    const customer: Customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      totalPurchases: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    onAddCustomer(customer);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage your customer database and track outstanding balances</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer profile for sales tracking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Address</Label>
                <Input
                  id="customerAddress"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <Button onClick={createCustomer} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>View and manage all customers</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <Badge variant={customer.outstandingBalance > 0 ? 'destructive' : 'default'}>
                        {customer.id}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><strong>Email:</strong> {customer.email}</div>
                      <div><strong>Phone:</strong> {customer.phone}</div>
                      <div><strong>Total Purchases:</strong> <span className="font-semibold text-green-600">₹{customer.totalPurchases.toLocaleString()}</span></div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm">
                        <strong>Outstanding Balance:</strong> 
                        <span className={`font-semibold ml-1 ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{customer.outstandingBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManager;
