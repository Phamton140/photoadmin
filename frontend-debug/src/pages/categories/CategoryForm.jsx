
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { categoryService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const CategoryForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
    type: 'main' // 'main' | 'sub'
  });

  // Data State
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Load Data
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        // 1. Fetch ALL categories to populate the parent dropdown
        const catsData = await categoryService.getAll().catch(err => {
          console.error("CategoryForm: Failed to load category list", err);
          return [];
        });
        const catsList = Array.isArray(catsData) ? catsData : (catsData?.data || []);
        setAllCategories(catsList);

        // 2. If editing, fetch the specific category details
        if (isEditMode) {
          const data = await categoryService.getById(id);
          
          // Determine if it's a subcategory based on parent_id presence
          const isSub = !!data.parent_id;

          setFormData({
            name: data.name || '',
            parent_id: data.parent_id ? String(data.parent_id) : '',
            type: isSub ? 'sub' : 'main'
          });
        }
      } catch (error) {
        console.error("CategoryForm: Error loading data:", error);
        toast({ title: "Error", description: "Failed to load form data", variant: "destructive" });
        navigate('/categories');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [isEditMode, id, navigate, toast]);

  // Filter potential parents for the dropdown
  const parentOptions = useMemo(() => {
    return allCategories.filter(c => {
      // 1. Must be a main category (parent_id is null)
      if (c.parent_id) return false;
      
      // 2. If editing, cannot be itself (prevent circular dependency)
      if (isEditMode && String(c.id) === String(id)) return false;

      return true;
    });
  }, [allCategories, isEditMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construct payload
      const payload = {
        name: formData.name,
        // If Main Category selected, parent_id is null.
        // If Subcategory selected, use the selected ID.
        parent_id: formData.type === 'sub' && formData.parent_id 
          ? parseInt(formData.parent_id) 
          : null
      };

      console.log("CategoryForm: Submitting payload:", payload);

      if (isEditMode) {
        await categoryService.update(id, payload);
        toast({ title: "Success", description: "Category updated successfully." });
      } else {
        await categoryService.create(payload);
        toast({ title: "Success", description: "Category created successfully." });
      }
      navigate('/categories');
    } catch (error) {
      console.error("CategoryForm: Error saving:", error);
      toast({ title: "Error", description: error.message || "Failed to save category", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Category' : 'Create Category'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/categories"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Category' : 'Add Category'}</h1>
          <p className="text-muted-foreground">Define category structure.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-6">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Wedding or Photography" 
              required
            />
          </div>

          {/* Type Selection Radio/Toggle */}
          <div className="grid gap-3">
            <Label className="text-base">Hierarchy Level</Label>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-full sm:w-auto">
                <input 
                  type="radio" 
                  name="type" 
                  value="main"
                  checked={formData.type === 'main'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'main' }))}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Main Category</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-full sm:w-auto">
                <input 
                  type="radio" 
                  name="type" 
                  value="sub"
                  checked={formData.type === 'sub'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'sub' }))}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Subcategory of...</span>
              </label>
            </div>
          </div>

          {/* Parent Dropdown - Only visible if 'Subcategory' is selected */}
          {formData.type === 'sub' && (
            <div className="grid gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-dashed animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="parent_id">Select Parent Category</Label>
              <select
                id="parent_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.parent_id}
                onChange={e => setFormData({...formData, parent_id: e.target.value})}
                required={formData.type === 'sub'}
              >
                <option value="">-- Choose a Main Category --</option>
                {parentOptions.length === 0 ? (
                   <option disabled>No main categories available</option>
                ) : (
                  parentOptions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
              </select>
              <p className="text-xs text-muted-foreground">
                This category will be nested under the selected parent.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/categories">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
            Save Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
