
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { packageService, categoryService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const PackageForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    subcategory_id: '',
    description: '',
    price: '',
    duration: '',
    duration_unit: 'hours'
  });
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        console.log("PackageForm: Fetching all categories...");
        // Fetch all categories using the corrected getAll endpoint
        const catsData = await categoryService.getAll().catch(err => {
          console.error("PackageForm: Failed to load categories:", err);
          toast({ title: "Error", description: "Could not load categories list", variant: "destructive" });
          return [];
        });
        
        console.log("PackageForm: Categories fetched:", catsData);
        
        // Robustly handle array or { data: [] } structure
        const catsList = Array.isArray(catsData) ? catsData : (catsData?.data || []);
        setAllCategories(catsList);

        if (isEditMode) {
          console.log(`PackageForm: Fetching package details for ID: ${id}`);
          const data = await packageService.getById(id);
          console.log("PackageForm: Package details fetched:", data);
          
          // Handle various ways category might be returned
          let catId = '';
          let subCatId = '';

          if (data.category_id) {
            catId = String(data.category_id);
          } else if (data.category && typeof data.category === 'object') {
            catId = String(data.category.id);
          } else if (data.category) {
            catId = String(data.category);
          }

          if (data.subcategory_id) {
             subCatId = String(data.subcategory_id);
          } else if (data.subcategory && typeof data.subcategory === 'object') {
             subCatId = String(data.subcategory.id);
          }

          setFormData({
            name: data.name || '',
            category_id: catId,
            subcategory_id: subCatId,
            description: data.description || '',
            price: data.price || '',
            duration: data.duration || '',
            duration_unit: data.duration_unit || 'hours'
          });
        }
      } catch (error) {
        console.error("PackageForm: Critical error loading data:", error);
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        navigate('/services');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, id, navigate, toast]);

  // Derived state for filtering categories
  const mainCategories = useMemo(() => {
    // Filter for categories with no parent_id (top level)
    const mains = allCategories.filter(c => !c.parent_id);
    console.log("PackageForm: Main categories derived:", mains.length);
    return mains;
  }, [allCategories]);

  const subCategories = useMemo(() => {
    if (!formData.category_id) return [];
    // Filter for categories where parent_id matches selected category_id
    const subs = allCategories.filter(c => String(c.parent_id) === String(formData.category_id));
    console.log(`PackageForm: Subcategories derived for parent ${formData.category_id}:`, subs.length);
    return subs;
  }, [allCategories, formData.category_id]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setFormData(prev => ({
      ...prev,
      category_id: newCategoryId,
      subcategory_id: '' // Reset subcategory when main category changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        ...formData,
        // Convert to numbers or nulls as appropriate for your API
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };

      console.log("PackageForm: Submitting payload:", payload);

      if (isEditMode) {
        await packageService.update(id, payload);
        toast({ title: "Success", description: "Package updated successfully." });
      } else {
        await packageService.create(payload);
        toast({ title: "Success", description: "Package created successfully." });
      }
      navigate('/services');
    } catch (error) {
      console.error("PackageForm: Error saving package:", error);
      toast({ title: "Error", description: error.message || "Failed to save package", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Package' : 'Create Package'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/services"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Package' : 'Add Package'}</h1>
          <p className="text-muted-foreground">Define service package details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Package Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Wedding Deluxe" 
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Details about what is included..." 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01"
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0.00" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input 
                id="duration" 
                type="number" 
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: e.target.value})}
                placeholder="1" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration_unit">Unit</Label>
              <select
                id="duration_unit"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.duration_unit}
                onChange={e => setFormData({...formData, duration_unit: e.target.value})}
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/services">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
            Save Package
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
