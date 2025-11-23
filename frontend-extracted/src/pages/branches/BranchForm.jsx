
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { branchService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const BranchForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    manager: ''
  });
  const [loading, setLoading] = useState(false);
  // No longer fetching data in edit mode via GET request, initial loading only for processing state
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.branch) {
        const data = location.state.branch;
        setFormData({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          manager: data.manager || ''
        });
      } else {
        toast({ 
          title: "Data Missing", 
          description: "Branch data not found. Please navigate from the Branches list.", 
          variant: "destructive" 
        });
        navigate('/branches');
      }
    }
  }, [isEditMode, location.state, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await branchService.update(id, formData);
      } else {
        await branchService.create(formData);
      }
      toast({ title: "Success", description: `Branch ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/branches');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Branch' : 'Create Branch'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/branches"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Branch' : 'Add Branch'}</h1>
          <p className="text-muted-foreground">Enter branch location details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Downtown HQ" 
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234 567 890" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Manager Name</Label>
              <Input 
                id="manager" 
                value={formData.manager} 
                onChange={e => setFormData({...formData, manager: e.target.value})}
                placeholder="Jane Doe" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/branches">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
            Save Branch
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BranchForm;
