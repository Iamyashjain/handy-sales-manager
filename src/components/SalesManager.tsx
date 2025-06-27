
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "./CustomerManager";
import { Product } from "./ProductManager";

interface SalesManagerProps {
  customers: Customer[];
  products: Product[];
  onUpdateCustomer: (customer: Customer) => void;
}

const SalesManager = ({ customers, products, onUpdateCustomer }: SalesManagerProps) => {
  const [sales, setSales] = useState([
    {
      id: "INV-001",
      date: "2024-06-20",
      customerId: customers[0]?.id || "CUST-001",
      customerName: customers[0]?.name || "ABC Corporation",
      customerEmail: customers[0]?.email || "contact@abc.com",
      items: [
        { name: "Product A", size: "500ml", quantity: 5, rate: 10000, amount: 50000 },
        { name: "Product B", size: "1kg", quantity: 3, rate: 25000, amount: 75000 }
      ],
      subtotal: 125000,
      transport: 5000,
      total: 130000,
      paidAmount: 115000,
      outstandingAmount: 15000,
      status: "partial"
    },
    {
      id: "INV-002", 
      date: "2024-06-19",
      customerId: customers[1]?.id || "CUST-002",
      customerName: customers[1]?.name || "Tech Solutions Ltd",
      customerEmail: customers[1]?.email || "info@techsolutions.com",
      items: [
        { name: "Product C", size: "2L", quantity: 10, rate: 15000, amount: 150000 },
        { name: "Product D", size: "Large", quantity: 2, rate: 30000, amount: 60000 }
      ],
      subtotal: 210000,
      transport: 2000,
      total: 212000,
      paidAmount: 212000,
      outstandingAmount: 0,
      status: "paid"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newSale, setNewSale] = useState({
    customerId: "",
    items: [{ productId: "", name: "", size: "", quantity: 1, rate: 0 }],
    transport: 0,
    paidAmount: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingSale, setViewingSale] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const addItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { productId: "", name: "", size: "", quantity: 1, rate: 0 }]
    });
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

  const createSale = () => {
    const { subtotal, total } = calculateTotal();
    const customer = customers.find(c => c.id === newSale.customerId);
    if (!customer) return;

    const outstandingAmount = total - newSale.paidAmount;
    
    const sale = {
      id: `INV-${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
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
      status: outstandingAmount > 0 ? "partial" : "paid"
    };
    
    setSales([sale, ...sales]);

    const updatedCustomer = {
      ...customer,
      totalPurchases: customer.totalPurchases + total,
      outstandingBalance: customer.outstandingBalance + outstandingAmount
    };
    onUpdateCustomer(updatedCustomer);

    setNewSale({
      customerId: "",
      items: [{ productId: "", name: "", size: "", quantity: 1, rate: 0 }],
      transport: 0,
      paidAmount: 0
    });
    setIsAddDialogOpen(false);
  };

  const viewSale = (sale) => {
    setViewingSale(sale);
    setIsViewDialogOpen(true);
  };

  const downloadInvoice = (sale) => {
    // Generate and download invoice PDF
    console.log("Downloading invoice for:", sale.id);
    alert(`Invoice ${sale.id} would be downloaded as PDF`);
  };

  const filteredSales = sales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div>
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

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {newSale.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><strong>Paid:</strong> <span className="text-green-600">₹{sale.paidAmount.toLocaleString()}</span></div>
                      {sale.outstandingAmount > 0 && (
                        <div><strong>Outstanding:</strong> <span className="text-red-600">₹{sale.outstandingAmount.toLocaleString()}</span></div>
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
                    <Button variant="outline" size="sm" onClick={() => downloadInvoice(sale)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default SalesManager;
