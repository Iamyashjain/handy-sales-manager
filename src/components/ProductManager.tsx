
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface Product {
  id: string;
  name: string;
  size: string;
  rate: number;
}

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductManager = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    size: "",
    rate: 0
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const addProduct = () => {
    const product: Product = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      size: newProduct.size,
      rate: newProduct.rate
    };
    
    onAddProduct(product);
    setNewProduct({ name: "", size: "", rate: 0 });
    setIsAddDialogOpen(false);
  };

  const updateProduct = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
      setIsEditDialogOpen(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog with predefined rates</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your catalog</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="productSize">Size</Label>
                <Input
                  id="productSize"
                  value={newProduct.size}
                  onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                  placeholder="Enter size (e.g., 500ml, Large, etc.)"
                />
              </div>
              <div>
                <Label htmlFor="productRate">Rate (₹)</Label>
                <Input
                  id="productRate"
                  type="number"
                  value={newProduct.rate}
                  onChange={(e) => setNewProduct({ ...newProduct, rate: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter rate in rupees"
                  step="0.01"
                  min="0"
                />
              </div>
              <Button onClick={addProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>View and manage your products</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                      <div><strong>Size:</strong> {product.size}</div>
                      <div><strong>Rate:</strong> <span className="font-semibold text-green-600">₹{product.rate}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>Update product details</DialogDescription>
                        </DialogHeader>
                        {editingProduct && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="editProductName">Product Name</Label>
                              <Input
                                id="editProductName"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                placeholder="Enter product name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editProductSize">Size</Label>
                              <Input
                                id="editProductSize"
                                value={editingProduct.size}
                                onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                                placeholder="Enter size"
                              />
                            </div>
                            <div>
                              <Label htmlFor="editProductRate">Rate (₹)</Label>
                              <Input
                                id="editProductRate"
                                type="number"
                                value={editingProduct.rate}
                                onChange={(e) => setEditingProduct({ ...editingProduct, rate: parseFloat(e.target.value) || 0 })}
                                placeholder="Enter rate in rupees"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            <Button onClick={updateProduct} className="w-full">
                              Update Product
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
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
    </div>
  );
};

export default ProductManager;
