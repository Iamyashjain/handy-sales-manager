
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Users, Receipt, FileText, Download, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sale } from "@/pages/Index";

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
  payments?: any[];
  sales?: Sale[];
}

const CustomerManager = ({ customers, onAddCustomer, onUpdateCustomer, payments = [], sales = [] }: CustomerManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);

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
    setIsAddDialogOpen(false);
  };

  const viewCustomerDetails = (customer: Customer) => {
    setViewingCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const generateStatement = (customer: Customer) => {
    setStatementCustomer(customer);
    setIsStatementDialogOpen(true);
  };

  const getCustomerPayments = (customerId: string) => {
    return payments.filter(payment => payment.customerId === customerId);
  };

  const getCustomerSales = (customerId: string) => {
    return sales.filter(sale => sale.customerId === customerId);
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Customer Statement Component
  const CustomerStatement = ({ customer }: { customer: Customer }) => {
    const customerSales = getCustomerSales(customer.id);
    const customerPayments = getCustomerPayments(customer.id);
    const totalInvoices = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return (
      <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Customer Account Statement</h1>
          <div className="text-gray-600">
            <p>Statement Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information:</h3>
          <div className="bg-gray-50 p-4 rounded grid grid-cols-2 gap-4">
            <div><strong>Name:</strong> {customer.name}</div>
            <div><strong>ID:</strong> {customer.id}</div>
            <div><strong>Email:</strong> {customer.email}</div>
            <div><strong>Phone:</strong> {customer.phone}</div>
            <div className="col-span-2"><strong>Address:</strong> {customer.address}</div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Summary:</h3>
          <div className="bg-blue-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Total Invoices:</strong> ₹{totalInvoices.toLocaleString()}</div>
              <div><strong>Total Paid:</strong> ₹{totalPaid.toLocaleString()}</div>
              <div><strong>Outstanding Balance:</strong> 
                <span className={`ml-1 font-bold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{customer.outstandingBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice History:</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Invoice #</th>
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
                <th className="border border-gray-300 p-2 text-right">Paid</th>
                <th className="border border-gray-300 p-2 text-right">Balance</th>
                <th className="border border-gray-300 p-2 text-right">Transport</th>
              </tr>
            </thead>
            <tbody>
              {customerSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="border border-gray-300 p-2">{sale.id}</td>
                  <td className="border border-gray-300 p-2">{sale.date}</td>
                  <td className="border border-gray-300 p-2 text-right">₹{sale.total.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-right">₹{sale.paidAmount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-right">₹{sale.outstandingAmount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-right">₹{sale.transport.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payments */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment History:</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Reference</th>
                <th className="border border-gray-300 p-2 text-right">Amount</th>
                <th className="border border-gray-300 p-2 text-left">Method</th>
                <th className="border border-gray-300 p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {customerPayments.map((payment, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{payment.date}</td>
                  <td className="border border-gray-300 p-2">{payment.invoiceId}</td>
                  <td className="border border-gray-300 p-2 text-right">₹{payment.amount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 capitalize">{payment.paymentMethod}</td>
                  <td className="border border-gray-300 p-2">{payment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage your customer database and track outstanding balances</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    <Button variant="outline" size="sm" onClick={() => viewCustomerDetails(customer)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => generateStatement(customer)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Statement
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {viewingCustomer?.name}</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div><strong>Customer ID:</strong> {viewingCustomer.id}</div>
                <div><strong>Email:</strong> {viewingCustomer.email}</div>
                <div><strong>Phone:</strong> {viewingCustomer.phone}</div>
                <div><strong>Address:</strong> {viewingCustomer.address}</div>
                <div><strong>Total Purchases:</strong> <span className="text-green-600">₹{viewingCustomer.totalPurchases.toLocaleString()}</span></div>
                <div>
                  <strong>Outstanding Balance:</strong> 
                  <span className={`ml-1 ${viewingCustomer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{viewingCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bill History */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold">Bill History</h4>
                </div>
                
                {getCustomerSales(viewingCustomer.id).length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Invoice #</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-right">Total</th>
                          <th className="p-3 text-right">Paid</th>
                          <th className="p-3 text-right">Balance</th>
                          <th className="p-3 text-right">Transport</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCustomerSales(viewingCustomer.id).map((sale) => (
                          <tr key={sale.id} className="border-t">
                            <td className="p-3">{sale.id}</td>
                            <td className="p-3">{sale.date}</td>
                            <td className="p-3 text-right text-blue-600 font-semibold">₹{sale.total.toLocaleString()}</td>
                            <td className="p-3 text-right text-green-600">₹{sale.paidAmount.toLocaleString()}</td>
                            <td className="p-3 text-right text-red-600">₹{sale.outstandingAmount.toLocaleString()}</td>
                            <td className="p-3 text-right">₹{sale.transport.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No bill history available</p>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="h-5 w-5 text-green-600" />
                  <h4 className="text-lg font-semibold">Payment History</h4>
                </div>
                
                {getCustomerPayments(viewingCustomer.id).length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Invoice Ref</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-left">Method</th>
                          <th className="p-3 text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCustomerPayments(viewingCustomer.id).map((payment, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{payment.date}</td>
                            <td className="p-3">{payment.invoiceId}</td>
                            <td className="p-3 text-right text-green-600 font-semibold">₹{payment.amount.toLocaleString()}</td>
                            <td className="p-3 capitalize">{payment.paymentMethod}</td>
                            <td className="p-3">{payment.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No payment history available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Customer Statement Dialog */}
      <Dialog open={isStatementDialogOpen} onOpenChange={setIsStatementDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Statement - {statementCustomer?.name}</DialogTitle>
          </DialogHeader>
          {statementCustomer && <CustomerStatement customer={statementCustomer} />}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsStatementDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print Statement
            </Button>
            <Button onClick={() => alert('Statement would be downloaded as PDF')}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManager;
