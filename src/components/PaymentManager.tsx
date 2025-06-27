
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, CreditCard, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "./CustomerManager";

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  date: string;
  notes: string;
}

interface PaymentManagerProps {
  payments: Payment[];
  customers: Customer[];
  onAddPayment: (payment: Payment) => void;
  onUpdatePayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
  onUpdateCustomer: (customer: Customer) => void;
}

const PaymentManager = ({ payments, customers, onAddPayment, onUpdatePayment, onDeletePayment, onUpdateCustomer }: PaymentManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPayment, setNewPayment] = useState({
    customerId: "",
    invoiceId: "",
    amount: 0,
    paymentMethod: "cash",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const createPayment = () => {
    const customer = customers.find(c => c.id === newPayment.customerId);
    if (!customer) return;

    const payment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      customerId: newPayment.customerId,
      customerName: customer.name,
      invoiceId: newPayment.invoiceId,
      amount: newPayment.amount,
      paymentMethod: newPayment.paymentMethod,
      date: newPayment.date,
      notes: newPayment.notes
    };
    
    onAddPayment(payment);
    setNewPayment({
      customerId: "",
      invoiceId: "",
      amount: 0,
      paymentMethod: "cash",
      notes: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
  };

  const startEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setNewPayment({
      customerId: payment.customerId,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      notes: payment.notes,
      date: payment.date
    });
    setIsEditDialogOpen(true);
  };

  const updatePayment = () => {
    if (!editingPayment) return;
    
    const customer = customers.find(c => c.id === newPayment.customerId);
    if (!customer) return;

    const updatedPayment: Payment = {
      ...editingPayment,
      customerId: newPayment.customerId,
      customerName: customer.name,
      invoiceId: newPayment.invoiceId,
      amount: newPayment.amount,
      paymentMethod: newPayment.paymentMethod,
      date: newPayment.date,
      notes: newPayment.notes
    };
    
    onUpdatePayment(updatedPayment);

    // Update customer balance - remove old payment amount and add new amount
    const balanceDifference = newPayment.amount - editingPayment.amount;
    const updatedCustomer = {
      ...customer,
      outstandingBalance: Math.max(0, customer.outstandingBalance - balanceDifference)
    };
    onUpdateCustomer(updatedCustomer);

    setEditingPayment(null);
    setIsEditDialogOpen(false);
  };

  const deletePayment = (payment: Payment) => {
    if (confirm(`Are you sure you want to delete payment ${payment.id}? This action cannot be undone.`)) {
      onDeletePayment(payment.id);
      
      // Update customer balance - add back the payment amount to outstanding balance
      const customer = customers.find(c => c.id === payment.customerId);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          outstandingBalance: customer.outstandingBalance + payment.amount
        };
        onUpdateCustomer(updatedCustomer);
      }
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-gray-600">Record partial payments and track customer balances</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Add a partial or full payment from a customer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentCustomer">Customer</Label>
                <Select value={newPayment.customerId} onValueChange={(value) => setNewPayment({ ...newPayment, customerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} (₹{customer.outstandingBalance.toLocaleString()} due)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="paymentInvoice">Invoice ID</Label>
                <Input
                  id="paymentInvoice"
                  value={newPayment.invoiceId}
                  onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
                  placeholder="Enter invoice ID"
                />
              </div>
              <div>
                <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter payment amount"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentNotes">Notes (Optional)</Label>
                <Input
                  id="paymentNotes"
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  placeholder="Add payment notes"
                />
              </div>
              <Button onClick={createPayment} className="w-full bg-green-600 hover:bg-green-700">
                Record Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all recorded payments</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-lg">{payment.id}</h3>
                      <Badge variant="outline">
                        {payment.paymentMethod}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div><strong>Customer:</strong> {payment.customerName}</div>
                      <div><strong>Invoice:</strong> {payment.invoiceId}</div>
                      <div><strong>Date:</strong> {payment.date}</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm">
                        <strong>Amount:</strong> 
                        <span className="font-semibold text-green-600 ml-1">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                      </div>
                      {payment.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Notes:</strong> {payment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEditPayment(payment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deletePayment(payment)} className="text-red-600 hover:text-red-700">
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

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment - {editingPayment?.id}</DialogTitle>
            <DialogDescription>
              Update payment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editPaymentCustomer">Customer</Label>
              <Select value={newPayment.customerId} onValueChange={(value) => setNewPayment({ ...newPayment, customerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} (₹{customer.outstandingBalance.toLocaleString()} due)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editPaymentDate">Payment Date</Label>
              <Input
                id="editPaymentDate"
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editPaymentInvoice">Invoice ID</Label>
              <Input
                id="editPaymentInvoice"
                value={newPayment.invoiceId}
                onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
                placeholder="Enter invoice ID"
              />
            </div>
            <div>
              <Label htmlFor="editPaymentAmount">Payment Amount (₹)</Label>
              <Input
                id="editPaymentAmount"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                placeholder="Enter payment amount"
              />
            </div>
            <div>
              <Label htmlFor="editPaymentMethod">Payment Method</Label>
              <Select value={newPayment.paymentMethod} onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editPaymentNotes">Notes (Optional)</Label>
              <Input
                id="editPaymentNotes"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                placeholder="Add payment notes"
              />
            </div>
            <Button onClick={updatePayment} className="w-full bg-blue-600 hover:bg-blue-700">
              Update Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManager;
