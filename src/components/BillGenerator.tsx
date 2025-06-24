
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Eye, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const BillGenerator = () => {
  const [billData, setBillData] = useState({
    companyName: "Your Business Name",
    companyAddress: "123 Business Street, City, State 12345",
    companyPhone: "(555) 123-4567",
    companyEmail: "info@yourbusiness.com",
    logoUrl: "",
    customer: {
      name: "",
      address: "",
      phone: "",
      email: ""
    },
    items: [
      { description: "", quantity: 1, rate: 0, amount: 0 }
    ],
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days"
  });

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  const addItem = () => {
    setBillData({
      ...billData,
      items: [...billData.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = billData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setBillData({ ...billData, items: updatedItems });
  };

  const removeItem = (index: number) => {
    if (billData.items.length > 1) {
      const updatedItems = billData.items.filter((_, i) => i !== index);
      setBillData({ ...billData, items: updatedItems });
    }
  };

  const calculateTotals = () => {
    const subtotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const InvoicePreview = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{billData.companyName}</h1>
          <div className="text-gray-600">
            <p>{billData.companyAddress}</p>
            <p>Phone: {billData.companyPhone}</p>
            <p>Email: {billData.companyEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
          <div className="text-gray-600">
            <p><strong>Invoice #:</strong> {invoiceNumber}</p>
            <p><strong>Date:</strong> {invoiceDate}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold">{billData.customer.name || "Customer Name"}</p>
          <p>{billData.customer.address || "Customer Address"}</p>
          <p>{billData.customer.phone || "Customer Phone"}</p>
          <p>{billData.customer.email || "Customer Email"}</p>
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
            {billData.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-3">{item.description || "Item description"}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-3 text-right">${item.rate.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-right">${item.amount.toFixed(2)}</td>
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-gray-400 font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
          <p className="text-gray-600">{billData.notes}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions:</h4>
          <p className="text-gray-600">{billData.terms}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bill Generator</h2>
          <p className="text-gray-600">Create professional invoices and bills</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bill Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Configure your invoice information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company Information</h3>
              <div className="grid gap-3">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={billData.companyName}
                    onChange={(e) => setBillData({ ...billData, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={billData.companyAddress}
                    onChange={(e) => setBillData({ ...billData, companyAddress: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={billData.companyPhone}
                      onChange={(e) => setBillData({ ...billData, companyPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={billData.companyEmail}
                      onChange={(e) => setBillData({ ...billData, companyEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Invoice Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Invoice Number</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Customer Information</h3>
              <div className="grid gap-3">
                <div>
                  <Label>Customer Name</Label>
                  <Input
                    value={billData.customer.name}
                    onChange={(e) => setBillData({
                      ...billData,
                      customer: { ...billData.customer, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={billData.customer.address}
                    onChange={(e) => setBillData({
                      ...billData,
                      customer: { ...billData.customer, address: e.target.value }
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={billData.customer.phone}
                      onChange={(e) => setBillData({
                        ...billData,
                        customer: { ...billData.customer, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={billData.customer.email}
                      onChange={(e) => setBillData({
                        ...billData,
                        customer: { ...billData.customer, email: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Items</h3>
                <Button onClick={addItem} size="sm" variant="outline">
                  Add Item
                </Button>
              </div>
              {billData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rate</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      value={`$${item.amount.toFixed(2)}`}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    {billData.items.length > 1 && (
                      <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="destructive"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="space-y-4">
              <div>
                <Label>Notes</Label>
                <Input
                  value={billData.notes}
                  onChange={(e) => setBillData({ ...billData, notes: e.target.value })}
                />
              </div>
              <div>
                <Label>Terms & Conditions</Label>
                <Input
                  value={billData.terms}
                  onChange={(e) => setBillData({ ...billData, terms: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Preview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Preview</CardTitle>
                <CardDescription>Preview your invoice before generating</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Full View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Invoice Preview</DialogTitle>
                    </DialogHeader>
                    <InvoicePreview />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden" style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
              <InvoicePreview />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillGenerator;
