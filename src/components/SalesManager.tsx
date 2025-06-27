
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, FileText, Printer, Edit, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "./CustomerManager";
import { Product } from "./ProductManager";
import { Sale } from "@/pages/Index";

interface SalesManagerProps {
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  onUpdateCustomer: (customer: Customer) => void;
  onAddSale: (sale: Sale) => void;
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
  onAddCustomer: (customer: Customer) => void;
}

const SalesManager = ({ customers, products, sales, onUpdateCustomer, onAddSale, onUpdateSale, onDeleteSale, onAddCustomer }: SalesManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newSale, setNewSale] = useState({
    customerId: "",
    items: [{ productId: "", name: "", size: "", quantity: 1, rate: 0 }],
    transport: 0,
    paidAmount: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printingSale, setPrintingSale] = useState<Sale | null>(null);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const addItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { productId: "", name: "", size: "", quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (newSale.items.length > 1) {
      const updatedItems = newSale.items.filter((_, i) => i !== index);
      setNewSale({ ...newSale, items: updatedItems });
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = newSale.items.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            return {
              ...item,
              productId: value,
              name: selectedProduct.name,
              size: selectedProduct.size,
              rate: selectedProduct.rate
            };
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewSale({ ...newSale, items: updatedItems });
  };

  const calculateTotal = () => {
    const subtotal = newSale.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const total = subtotal + newSale.transport;
    return { subtotal, total };
  };

  const createCustomer = () => {
    const customer = {
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
    setIsAddCustomerDialogOpen(false);
    setNewSale({ ...newSale, customerId: customer.id });
  };

  const createSale = () => {
    const { subtotal, total } = calculateTotal();
    const customer = customers.find(c => c.id === newSale.customerId);
    if (!customer) return;

    const outstandingAmount = total - newSale.paidAmount;
    
    const sale: Sale = {
      id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
      date: newSale.date,
      customerId: newSale.customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      items: newSale.items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate
      })),
      subtotal,
      transport: newSale.transport,
      total,
      paidAmount: newSale.paidAmount,
      outstandingAmount,
      status: outstandingAmount > 0 ? (newSale.paidAmount > 0 ? "partial" : "unpaid") : "paid"
    };
    
    onAddSale(sale);

    const updatedCustomer = {
      ...customer,
      totalPurchases: customer.totalPurchases + total,
      outstandingBalance: customer.outstandingBalance + outstandingAmount
    };
    onUpdateCustomer(updatedCustomer);

    setPrintingSale(sale);
    setIsPrintDialogOpen(true);

    setNewSale({
      customerId: "",
      items: [{ productId: "", name: "", size: "", quantity: 1, rate: 0 }],
      transport: 0,
      paidAmount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
  };

  const startEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setNewSale({
      customerId: sale.customerId,
      items: sale.items.map(item => ({
        productId: "",
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        rate: item.rate
      })),
      transport: sale.transport,
      paidAmount: sale.paidAmount,
      date: sale.date
    });
    setIsEditDialogOpen(true);
  };

  const updateSale = () => {
    if (!editingSale) return;
    
    const { subtotal, total } = calculateTotal();
    const customer = customers.find(c => c.id === newSale.customerId);
    if (!customer) return;

    const outstandingAmount = total - newSale.paidAmount;
    
    const updatedSale: Sale = {
      ...editingSale,
      date: newSale.date,
      customerId: newSale.customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      items: newSale.items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate
      })),
      subtotal,
      transport: newSale.transport,
      total,
      paidAmount: newSale.paidAmount,
      outstandingAmount,
      status: outstandingAmount > 0 ? (newSale.paidAmount > 0 ? "partial" : "unpaid") : "paid"
    };
    
    onUpdateSale(updatedSale);

    // Update customer balance
    const oldCustomer = customers.find(c => c.id === editingSale.customerId);
    if (oldCustomer) {
      const updatedOldCustomer = {
        ...oldCustomer,
        totalPurchases: oldCustomer.totalPurchases - editingSale.total + total,
        outstandingBalance: oldCustomer.outstandingBalance - editingSale.outstandingAmount + outstandingAmount
      };
      onUpdateCustomer(updatedOldCustomer);
    }

    setEditingSale(null);
    setIsEditDialogOpen(false);
  };

  const deleteSale = (sale: Sale) => {
    if (confirm(`Are you sure you want to delete sale ${sale.id}? This action cannot be undone.`)) {
      onDeleteSale(sale.id);
      
      // Update customer balance
      const customer = customers.find(c => c.id === sale.customerId);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          totalPurchases: customer.totalPurchases - sale.total,
          outstandingBalance: customer.outstandingBalance - sale.outstandingAmount
        };
        onUpdateCustomer(updatedCustomer);
      }
    }
  };

  const viewSale = (sale: Sale) => {
    setViewingSale(sale);
    setIsViewDialogOpen(true);
  };

  const printInvoice = (sale: Sale) => {
    setPrintingSale(sale);
    setIsPrintDialogOpen(true);
  };

  const downloadInvoice = (sale: Sale) => {
    console.log("Downloading invoice for:", sale.id);
    alert(`Invoice ${sale.id} would be downloaded as PDF`);
  };

  const filteredSales = sales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Invoice Template Component
  const InvoiceTemplate = ({ sale }: { sale: Sale }) => (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Your Business Name</h1>
          <div className="text-gray-600">
            <p>123 Business Street, City, State 12345</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@yourbusiness.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
          <div className="text-gray-600">
            <p><strong>Invoice #:</strong> {sale.id}</p>
            <p><strong>Date:</strong> {sale.date}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold">{sale.customerName}</p>
          <p>{sale.customerEmail}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.filter(item => item.quantity > 0).map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-3">{item.name} - {item.size}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-3 text-right">₹{item.rate.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-right">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span>Subtotal:</span>
            <span>₹{sale.subtotal.toFixed(2)}</span>
          </div>
          {sale.transport > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Transport:</span>
              <span>₹{sale.transport.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-b-2 border-gray-400 font-bold text-lg">
            <span>Total:</span>
            <span>₹{sale.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-green-600">
            <span>Paid:</span>
            <span>₹{sale.paidAmount.toFixed(2)}</span>
          </div>
          {sale.outstandingAmount > 0 && (
            <div className="flex justify-between py-2 text-red-600 font-bold">
              <span>Outstanding:</span>
              <span>₹{sale.outstandingAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sales Management</h2>
          <p className="text-gray-600">Manage your sales transactions and generate invoices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
              <DialogDescription>
                Add a new sales transaction and generate invoice
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="saleCustomer">Select Customer</Label>
                  <Select value={newSale.customerId} onValueChange={(value) => setNewSale({ ...newSale, customerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>&nbsp;</Label>
                  <Button type="button" onClick={() => setIsAddCustomerDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="saleDate">Sale Date</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={newSale.date}
                  onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {newSale.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Select Product</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => updateItem(index, 'productId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {product.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Size</Label>
                      <Input
                        value={item.size}
                        onChange={(e) => updateItem(index, 'size', e.target.value)}
                        placeholder="Size"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>Rate (₹)</Label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        value={`₹${(item.quantity * item.rate).toLocaleString()}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="flex items-end">
                      {newSale.items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  <Label htmlFor="transport">Transport Charges (₹)</Label>
                  <Input
                    id="transport"
                    type="number"
                    value={newSale.transport}
                    onChange={(e) => setNewSale({ ...newSale, transport: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter transport charges"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateTotal().subtotal.toLocaleString()}</span>
                    </div>
                    {newSale.transport > 0 && (
                      <div className="flex justify-between">
                        <span>Transport:</span>
                        <span>₹{newSale.transport.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{calculateTotal().total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paidAmount">Amount Paid (₹)</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    value={newSale.paidAmount}
                    onChange={(e) => setNewSale({ ...newSale, paidAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter amount received"
                    max={calculateTotal().total}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Outstanding: ₹{Math.max(0, calculateTotal().total - newSale.paidAmount).toLocaleString()}
                  </p>
                </div>

                <Button onClick={createSale} className="w-full bg-green-600 hover:bg-green-700">
                  Create Sale & Generate Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>View and manage your sales transactions</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{sale.id}</h3>
                      <Badge variant={sale.status === 'paid' ? 'default' : sale.status === 'partial' ? 'secondary' : 'destructive'}>
                        {sale.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><strong>Customer:</strong> {sale.customerName}</div>
                      <div><strong>Date:</strong> {sale.date}</div>
                      <div><strong>Total:</strong> <span className="font-semibold text-green-600">₹{sale.total.toLocaleString()}</span></div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div><strong>Paid:</strong> <span className="text-green-600">₹{sale.paidAmount.toLocaleString()}</span></div>
                      {sale.outstandingAmount > 0 && (
                        <div><strong>Outstanding:</strong> <span className="text-red-600">₹{sale.outstandingAmount.toLocaleString()}</span></div>
                      )}
                      {sale.transport > 0 && (
                        <div><strong>Transport:</strong> <span className="text-blue-600">₹{sale.transport.toLocaleString()}</span></div>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">
                        <strong>Items:</strong> {sale.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewSale(sale)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => startEditSale(sale)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => printInvoice(sale)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadInvoice(sale)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteSale(sale)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer profile</DialogDescription>
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

      {/* Edit Sale Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sale - {editingSale?.id}</DialogTitle>
            <DialogDescription>
              Update sales transaction details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSaleCustomer">Select Customer</Label>
              <Select value={newSale.customerId} onValueChange={(value) => setNewSale({ ...newSale, customerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editSaleDate">Sale Date</Label>
              <Input
                id="editSaleDate"
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {newSale.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Select Product</Label>
                    <Select 
                      value={item.productId} 
                      onValueChange={(value) => updateItem(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Size</Label>
                    <Input
                      value={item.size}
                      onChange={(e) => updateItem(index, 'size', e.target.value)}
                      placeholder="Size"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      value={`₹${(item.quantity * item.rate).toLocaleString()}`}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="flex items-end">
                    {newSale.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <Label htmlFor="editTransport">Transport Charges (₹)</Label>
                <Input
                  id="editTransport"
                  type="number"
                  value={newSale.transport}
                  onChange={(e) => setNewSale({ ...newSale, transport: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter transport charges"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal().subtotal.toLocaleString()}</span>
                  </div>
                  {newSale.transport > 0 && (
                    <div className="flex justify-between">
                      <span>Transport:</span>
                      <span>₹{newSale.transport.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{calculateTotal().total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="editPaidAmount">Amount Paid (₹)</Label>
                <Input
                  id="editPaidAmount"
                  type="number"
                  value={newSale.paidAmount}
                  onChange={(e) => setNewSale({ ...newSale, paidAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter amount received"
                  max={calculateTotal().total}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Outstanding: ₹{Math.max(0, calculateTotal().total - newSale.paidAmount).toLocaleString()}
                </p>
              </div>

              <Button onClick={updateSale} className="w-full bg-blue-600 hover:bg-blue-700">
                Update Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Details - {viewingSale?.id}</DialogTitle>
          </DialogHeader>
          {viewingSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Customer:</strong> {viewingSale.customerName}
                </div>
                <div>
                  <strong>Date:</strong> {viewingSale.date}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <Badge className="ml-2" variant={viewingSale.status === 'paid' ? 'default' : 'secondary'}>
                    {viewingSale.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="border rounded">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingSale.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{item.name} - {item.size}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.rate.toLocaleString()}</td>
                          <td className="p-2 text-right">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{viewingSale.subtotal.toLocaleString()}</span>
                  </div>
                  {viewingSale.transport > 0 && (
                    <div className="flex justify-between">
                      <span>Transport:</span>
                      <span>₹{viewingSale.transport.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{viewingSale.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>₹{viewingSale.paidAmount.toLocaleString()}</span>
                  </div>
                  {viewingSale.outstandingAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Outstanding:</span>
                      <span>₹{viewingSale.outstandingAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Invoice Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice - {printingSale?.id}</DialogTitle>
          </DialogHeader>
          {printingSale && <InvoiceTemplate sale={printingSale} />}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button onClick={() => downloadInvoice(printingSale!)}>
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesManager;
