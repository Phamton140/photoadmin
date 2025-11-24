
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, MoreHorizontal, Pencil, Trash2, Shirt, Loader2, Settings, AlertTriangle, Maximize2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { packageService, clothingService, categoryService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import ConfirmDialog from "@/components/ConfirmDialog";

// Simple Error Boundary Component for internal use
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ServicesList Error Boundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 border border-red-200 bg-red-50 text-red-700 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-5 w-5" />
            <h2>Something went wrong rendering this component.</h2>
          </div>
          <p className="text-sm font-mono bg-white p-2 rounded border border-red-100">
            {this.state.error?.toString()}
          </p>
          <Button variant="outline" size="sm" className="w-fit mt-2" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ServicesListContent = () => {
  const [packages, setPackages] = useState([]);
  const [clothing, setClothing] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('packages');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'package' or 'clothing'
  const [previewImage, setPreviewImage] = useState(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ServicesList: Starting data fetch...");
      
      // Fetch packages, clothing, and categories in parallel with individual error catching
      const [packagesResult, clothingResult, categoriesResult] = await Promise.allSettled([
        packageService.getAll(),
        clothingService.getAll(),
        categoryService.getAll()
      ]);

      // Handle Packages
      if (packagesResult.status === 'fulfilled') {
        const pData = packagesResult.value;
        setPackages(Array.isArray(pData) ? pData : (pData?.data || []));
      } else {
        console.error("Failed to fetch packages:", packagesResult.reason);
        toast({ title: "Warning", description: "Could not load packages.", variant: "warning" });
      }

      // Handle Clothing
      if (clothingResult.status === 'fulfilled') {
        const cData = clothingResult.value;
        setClothing(Array.isArray(cData) ? cData : (cData?.data || []));
      } else {
        console.error("Failed to fetch clothing:", clothingResult.reason);
        setClothing([]);
        toast({ title: "Warning", description: "Could not load clothing inventory.", variant: "warning" });
      }

      // Handle Categories
      if (categoriesResult.status === 'fulfilled') {
        const catData = categoriesResult.value;
        setCategories(Array.isArray(catData) ? catData : (catData?.data || []));
      } else {
        console.error("Failed to fetch categories:", categoriesResult.reason);
        setCategories([]);
      }

    } catch (error) {
      console.error("Critical error in ServicesList fetchData:", error);
      setError("Failed to initialize services module. Please check console.");
      toast({ title: "Error", description: "Critical error loading data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    try {
      if (deleteType === 'package') {
        await packageService.delete(deleteId);
      } else {
        await clothingService.delete(deleteId);
      }
      toast({ title: "Success", description: "Item deleted successfully" });
      fetchData(); // Reload data
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Error", description: error.message || "Failed to delete item", variant: "destructive" });
    } finally {
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  const openDelete = (id, type) => {
    setDeleteId(id);
    setDeleteType(type);
  };

  // --- Safe Render Helpers ---

  const safeRender = (content, fallback = '-') => {
    if (content === null || content === undefined) return fallback;
    if (typeof content === 'object') {
      // Try to find a name or label if it's an object (relation)
      return content.name || content.label || content.title || JSON.stringify(content);
    }
    return String(content);
  };

  const getCategoryName = (item) => {
    if (!item) return 'Uncategorized';
    
    try {
      if (item.category && typeof item.category === 'object') {
        return item.category.name || 'Unknown Category';
      }
      if (item.category_id && categories.length > 0) {
        const cat = categories.find(c => String(c.id) === String(item.category_id));
        if (cat) return cat.name;
      }
      if (typeof item.category === 'string') return item.category;
    } catch (e) {
      console.error("Error resolving category:", e);
    }
    return 'Uncategorized';
  };

  const getSubcategoryName = (item) => {
    if (!item) return null;
    try {
      if (item.subcategory && typeof item.subcategory === 'object') return item.subcategory.name;
      if (item.subcategory_id && categories.length > 0) {
        const sub = categories.find(c => String(c.id) === String(item.subcategory_id));
        if (sub) return sub.name;
      }
    } catch (e) { console.error(e); }
    return null;
  };

  const getBranchName = (item) => {
    if (!item) return '-';
    try {
      if (item.branch && typeof item.branch === 'object') {
        return item.branch.name || 'Unknown Branch';
      }
      if (item.branch) return String(item.branch);
      if (item.branch_id) return `Branch #${item.branch_id}`;
    } catch (e) {
      console.error("Error resolving branch:", e);
    }
    return '-';
  };

  const getStatusBadge = (status) => {
    const safeStatus = String(status || 'unknown').toLowerCase();
    const styles = {
      available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      reserved: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "in session": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "in laundry": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      damaged: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    
    return (
      <Badge variant="outline" className={`border-0 ${styles[safeStatus] || "bg-gray-100 text-gray-800"}`}>
        {status || 'Unknown'}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="p-8 text-center border rounded-lg bg-red-50 text-red-600">
        <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Module</h3>
        <p>{error}</p>
        <Button onClick={fetchData} className="mt-4" variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet><title>Services | Photoadmin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Module</h1>
          <p className="text-muted-foreground">Manage service packages and clothing inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/categories">
              <Settings className="mr-2 h-4 w-4" />
              Manage Categories
            </Link>
          </Button>
          <Button asChild>
            <Link to={activeTab === 'packages' ? "/services/packages/create" : "/services/clothing/create"}>
              <Plus className="mr-2 h-4 w-4" /> 
              Add {activeTab === 'packages' ? 'Package' : 'Clothing'}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="rounded-md border bg-white dark:bg-gray-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></TableCell></TableRow>
                ) : packages.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No packages found.</TableCell></TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id || `pkg-${Math.random()}`}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" /> 
                        <div>
                          <div>{safeRender(pkg.name)}</div>
                          {pkg.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{safeRender(pkg.description)}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryName(pkg)}
                        {getSubcategoryName(pkg) && <span className="text-xs text-muted-foreground block">{getSubcategoryName(pkg)}</span>}
                      </TableCell>
                      <TableCell>${safeRender(pkg.price)}</TableCell>
                      <TableCell>{safeRender(pkg.duration)} {safeRender(pkg.duration_unit)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/services/packages/${pkg.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => openDelete(pkg.id, 'package')}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="clothing" className="space-y-4">
          <div className="rounded-md border bg-white dark:bg-gray-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></TableCell></TableRow>
                ) : clothing.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No clothing items found.</TableCell></TableRow>
                ) : (
                  clothing.map((item) => (
                    <TableRow key={item.id || `clothing-${Math.random()}`}>
                      <TableCell className="font-medium flex items-center gap-3">
                        {/* Image Thumbnail with Modal Trigger */}
                        <div 
                          className={`h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0 border relative group ${item.image_url ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all' : 'cursor-default'}`}
                          onClick={() => item.image_url && setPreviewImage({ url: item.image_url, title: item.name })}
                        >
                          {item.image_url ? (
                            <>
                              <img 
                                src={item.image_url} 
                                alt={item.name || 'Item'} 
                                className="h-full w-full object-cover" 
                                onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=X'; }} 
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Shirt className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div>{safeRender(item.name)}</div>
                      </TableCell>
                      <TableCell>
                        {getCategoryName(item)}
                        {getSubcategoryName(item) && <span className="text-xs text-muted-foreground block">{getSubcategoryName(item)}</span>}
                      </TableCell>
                      <TableCell>{getBranchName(item)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.price ? `$${safeRender(item.price)}` : '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/services/clothing/${item.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => openDelete(item.id, 'clothing')}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Deletes */}
      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Delete ${deleteType === 'package' ? 'Package' : 'Clothing Item'}`}
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
      />

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
           <DialogHeader>
              <DialogTitle>{previewImage?.title || 'Item Preview'}</DialogTitle>
           </DialogHeader>
           <div className="flex-1 flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-hidden">
              {previewImage && (
                <img 
                  src={previewImage.url} 
                  alt={previewImage.title} 
                  className="max-h-[70vh] w-full object-contain rounded shadow-sm" 
                />
              )}
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export wrapped component to catch render errors
const ServicesList = () => (
  <ErrorBoundary>
    <ServicesListContent />
  </ErrorBoundary>
);

export default ServicesList;
