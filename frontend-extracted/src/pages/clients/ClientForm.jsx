
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { clientService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const ClientForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.client) {
        const data = location.state.client;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          notes: data.notes || ''
        });
      } else {
        toast({ 
          title: "Data Missing", 
          description: "Client data not found. Please navigate from the Clients list.", 
          variant: "destructive" 
        });
        navigate('/clients');
      }
    }
  }, [isEditMode, location.state, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim()
      };
      
      if (isEditMode) {
        await clientService.update(id, payload);
      } else {
        await clientService.create(payload);
      }
      toast({ title: "Success", description: `Client ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/clients');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Client' : 'Create Client'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/clients"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Client' : 'Add Client'}</h1>
          <p className="text-muted-foreground">Manage customer information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
                placeholder="John" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
                placeholder="Doe" 
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 234 567 8900" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes" 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional information..." 
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/clients">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
             {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
             Save Client
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
