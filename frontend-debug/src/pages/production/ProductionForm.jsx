
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { productionService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const ProductionForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    stage: '',
    quantity: '1'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.item) {
        const data = location.state.item;
        setFormData({
          name: data.name || '',
          stage: data.stage || '',
          quantity: data.quantity || '1'
        });
      } else {
        toast({ 
          title: "Data Missing", 
          description: "Production item data not found. Please navigate from the Production list.", 
          variant: "destructive" 
        });
        navigate('/production');
      }
    }
  }, [isEditMode, location.state, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await productionService.update(id, formData);
      } else {
        await productionService.create(formData);
      }
      toast({ title: "Success", description: `Item ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/production');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Item' : 'Add Item'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/production"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Production Item' : 'Add Production Item'}</h1>
          <p className="text-muted-foreground">Manage production inventory and stages.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Photo Album XL" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
               <Label htmlFor="stage">Stage</Label>
               <Input 
                 id="stage" 
                 value={formData.stage}
                 onChange={e => setFormData({...formData, stage: e.target.value})}
                 placeholder="Printing, Binding, etc." 
               />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="quantity">Quantity</Label>
               <Input 
                 id="quantity" 
                 type="number"
                 value={formData.quantity}
                 onChange={e => setFormData({...formData, quantity: e.target.value})}
               />
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/production">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
             {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
             Save Item
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductionForm;
