
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "./ProductManager";

interface PurchaseManagerProps {
  products: Product[];
}

const PurchaseManager = ({ products }: PurchaseManagerProps) => {
  const [purchases, setPurchases] = useState([
    {
      id: "PUR-001",
      date: "2024-06-20",
      supplier: "ABC Suppliers Ltd",
      supplierEmail: "orders@abcsuppliers.com",
      invoiceNumber: "SUP-2024-001",
      items: [
        { name: "Raw Material A", size: "500g", quantity: 100, unitPrice: 15, amount: 1500 },
        { name: "Component B", size: "1kg", quantity: 50, unitPrice: 25, amount: 1250 }
      ],
      subtotal: 2750,
      tax: 275,
      total: 3025,
      status: "received"
    },
    {
      id: "PUR-002",
      date: "2024-06-19",
      supplier: "Global Parts Inc",
      supplierEmail: "supply@globalparts.com",
      invoiceNumber: "GP-INV-456",
      items: [
        { name: "Electronic Parts", size: "Pack", quantity: 25, unitPrice: 80, amount: 2000 },
        { name: "Packaging Materials", size: "Roll", quantity: 200, unitPrice: 2.5, amount: 500 }
      ],
      subtotal: 2500,
      tax: 250,
      total: 2750,
      status: "pending"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newPurchase, setNewPurchase] = useState({
    supplier: "",
    supplierEmail: "",
    invoiceNumber: "",
    items: [{ productId: "", name: "", size: "", quantity: 1, unitPrice: 0 }]
  });

  const addItem = () => {
    setNewPurchase({
      ...newPurchase,
      items: [...newPurchase.items, { productId: "", name: "", size: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = newPurchase.items.map((item, i) => {
      if (i === index) {
        if (field === 'productId') {
          // Auto-fill product details when product is selected
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            return {
              ...item,
              productId: value,
              name: selectedProduct.name,
              size: selectedProduct.size,
              unitPrice: selectedProduct.rate
            };
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setNewPurchase({ ...newPurchase, items: updatedItems });
  };

  const calculateTotal = () => {
    const subtotal = newPurchase.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1; // 10% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const createPurchase = () => {
    const { subtotal, tax, total } = calculateTotal();
    const purchase = {
      id: `PUR-${String(purchases.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      supplier: newPurchase.supplier,
      supplierEmail: newPurchase.supplierEmail,
      invoiceNumber: newPurchase.invoiceNumber,
      items: newPurchase.items.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice
      })),
      subtotal,
      tax,
      total,
      status: "pending"
    };
    
    setPurchases([purchase, ...purchases]);
    setNewPurchase({
      supplier: "",
      supplierEmail: "",
      invoiceNumber: "",
      items: [{ productId: "", name: "", size: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const filteredPurchases = purchases.filter(purchase => 
    purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Purchase Management</h2>
          <p className="text-gray-600">Track purchases and manage supplier transactions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Purchase</DialogTitle>
              <DialogDescription>
                Add a new purchase transaction from supplier
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier Name</Label>
                  <Input
                    id="supplier"
                    value={newPurchase.supplier}
                    onChange={(e) => setNewPurchase({ ...newPurchase, supplier: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierEmail">Supplier Email</Label>
                  <Input
                    id="supplierEmail"
                    type="email"
                    value={newPurchase.supplierEmail}
                    onChange={(e) => setNewPurchase({ ...newPurchase, supplierEmail: e.target.value })}
                    placeholder="Enter supplier email"
                  />
                </div>
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={newPurchase.invoiceNumber}
                    onChange={(e) => setNewPurchase({ ...newPurchase, invoiceNumber: e.target.value })}
                    placeholder="Supplier invoice number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {newPurchase.items.map((item, index) => (
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
                        disabled
                        className="bg-gray-50"
                        placeholder="Auto-filled"
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
                      <Label>Unit Price (₹)</Label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        value={`₹${(item.quantity * item.unitPrice).toFixed(2)}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateTotal().subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>₹{calculateTotal().tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{calculateTotal().total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={createPurchase} className="w-full bg-blue-600 hover:bg-blue-700">
                  Record Purchase
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
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>View and manage your purchase transactions</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{purchase.id}</h3>
                      <Badge variant={purchase.status === 'received' ? 'default' : 'secondary'}>
                        {purchase.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><strong>Supplier:</strong> {purchase.supplier}</div>
                      <div><strong>Date:</strong> {purchase.date}</div>
                      <div><strong>Invoice:</strong> {purchase.invoiceNumber}</div>
                      <div><strong>Total:</strong> <span className="font-semibold text-blue-600">₹{purchase.total.toFixed(2)}</span></div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">
                        <strong>Items:</strong> {purchase.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Receipt
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

export default PurchaseManager;
