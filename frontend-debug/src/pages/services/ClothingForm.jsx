
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload, X, Shirt } from 'lucide-react';
import { clothingService, branchService, categoryService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const ClothingForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    subcategory_id: '',
    branch_id: '',
    price: '',
    status: 'available'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        console.log("ClothingForm: Starting initial data fetch...");
        
        const [branchData, categoryData] = await Promise.all([
          branchService.getAll().catch(e => { console.error("Branch load error", e); return []; }),
          categoryService.getAll().catch(e => { console.error("Category load error", e); return []; })
        ]);

        setBranches(Array.isArray(branchData) ? branchData : (branchData?.data || []));
        setAllCategories(Array.isArray(categoryData) ? categoryData : (categoryData?.data || []));

        if (isEditMode) {
          console.log(`ClothingForm: Fetching item details for ID: ${id}`);
          const data = await clothingService.getById(id);
          console.log("ClothingForm: Item details:", data);
          
          let catId = '';
          let subCatId = '';

          if (data.category_id) {
             catId = String(data.category_id);
          } else if (data.category && typeof data.category === 'object') {
             catId = String(data.category.id);
          }

          if (data.subcategory_id) {
             subCatId = String(data.subcategory_id);
          } else if (data.subcategory && typeof data.subcategory === 'object') {
             subCatId = String(data.subcategory.id);
          }

          let bId = '';
          if (data.branch_id) {
            bId = String(data.branch_id);
          } else if (data.branch && typeof data.branch === 'object') {
            bId = String(data.branch.id);
          }

          setFormData({
            name: data.name || '',
            category_id: catId,
            subcategory_id: subCatId,
            branch_id: bId,
            price: data.price || '',
            status: data.status || 'available'
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      } catch (error) {
        console.error("ClothingForm: Error fetching clothing details:", error);
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        navigate('/services');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [isEditMode, id, toast, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const mainCategories = useMemo(() => {
    return allCategories.filter(c => !c.parent_id);
  }, [allCategories]);

  const subCategories = useMemo(() => {
    if (!formData.category_id) return [];
    return allCategories.filter(c => String(c.parent_id) === String(formData.category_id));
  }, [allCategories, formData.category_id]);

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category_id: e.target.value,
      subcategory_id: '' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      
      // Append all fields to FormData
      data.append('name', formData.name);
      data.append('status', formData.status);
      data.append('price', formData.price || ''); // Send empty string if empty
      
      if (formData.category_id) {
        data.append('category_id', formData.category_id);
      }
      
      if (formData.subcategory_id) {
        data.append('subcategory_id', formData.subcategory_id);
      }

      if (formData.branch_id) {
        data.append('branch_id', formData.branch_id);
      }
      
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      // Log what we are sending
      console.log("ClothingForm: Submitting FormData:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      if (isEditMode) {
        // Using update (PUT) from service. 
        // Note: If backend requires POST for multipart update, this might need adjustment,
        // but we follow the service definition here.
        await clothingService.update(id, data);
      } else {
        await clothingService.create(data);
      }

      toast({ title: "Success", description: `Clothing item ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/services');
    } catch (error) {
      console.error("ClothingForm: Error saving item:", error);
      toast({ title: "Error", description: error.message || "Failed to save item", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Clothing' : 'Add Clothing'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/services"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Clothing' : 'Add Clothing'}</h1>
          <p className="text-muted-foreground">Manage inventory item details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Upload Section */}
          <div className="col-span-full md:col-span-1">
             <Label className="block mb-2">Item Photo</Label>
             <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center min-h-[240px] bg-gray-50 dark:bg-gray-900/50 relative">
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[200px] rounded-md object-contain" 
                    />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full inline-flex">
                      <Shirt className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Upload photo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG</p>
                    </div>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('image').click()}>
                      <Upload className="mr-2 h-4 w-4" /> Select File
                    </Button>
                  </div>
                )}
             </div>
          </div>

          {/* Fields Section */}
          <div className="col-span-full md:col-span-1 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Red Velvet Gown" 
                required
              />
            </div>
            
            {/* Main Category Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category_id}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {mainCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="subcategory_id">Subcategory (Optional)</Label>
              <select
                id="subcategory_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.subcategory_id}
                onChange={e => setFormData({...formData, subcategory_id: e.target.value})}
                disabled={!formData.category_id || subCategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Full Width Fields */}
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="branch_id">Branch</Label>
              <select
                id="branch_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.branch_id}
                onChange={e => setFormData({...formData, branch_id: e.target.value})}
                required
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="status">Status</Label>
               <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="in laundry">In Laundry</option>
                <option value="damaged">Damaged</option>
                <option value="in session">In Session</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (Optional)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="Rental price if applicable" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/services">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
            Save Item
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClothingForm;
