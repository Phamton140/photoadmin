
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const ServiceForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      // Mock fetch for edit mode
      // In a real app: apiRequest(`/services/${id}`).then(...)
      setFormData({
        name: 'Portrait Session',
        description: 'Standard portrait photography session',
        price: '150.00',
        duration: '60'
      });
      // Simulate existing image
      setImagePreview("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
    }
  }, [isEditMode, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Reset file input if needed via ref
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Service ${isEditMode ? 'updated' : 'created'} successfully.`,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Service' : 'Create Service'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/services"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Service' : 'Add Service'}</h1>
          <p className="text-muted-foreground">Define service details, pricing, and media.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Portrait Session" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the service..." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="99.00" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                  placeholder="60" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <Label>Vestment / Clothing Photo</Label>
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
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full inline-flex">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
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
             <p className="text-xs text-muted-foreground">
               Upload a reference photo for clothing or vestments associated with this service.
             </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild><Link to="/services">Cancel</Link></Button>
          <Button disabled={loading}>
            {loading && <span className="animate-spin mr-2">⏳</span>}
            Save Service
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
