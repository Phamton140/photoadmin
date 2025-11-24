
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  reservationService, 
  clientService, 
  packageService, 
  clothingService 
} from '@/services/api';

const ReservationForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [clothes, setClothes] = useState([]);

  const [formData, setFormData] = useState({
    client_id: '',
    serviceable_type: 'package', // 'package' or 'cloth'
    serviceable_id: '',
    date: '',
    total_amount: ''
  });

  useEffect(() => {
    const fetchDependencies = async () => {
      setInitialLoading(true);
      try {
        // Load dependent data for dropdowns
        const [clientsData, packagesData, clothesData] = await Promise.all([
          clientService.getAll().catch(() => []),
          packageService.getAll().catch(() => []),
          clothingService.getAll().catch(() => [])
        ]);

        setClients(Array.isArray(clientsData) ? clientsData : (clientsData?.data || []));
        setPackages(Array.isArray(packagesData) ? packagesData : (packagesData?.data || []));
        setClothes(Array.isArray(clothesData) ? clothesData : (clothesData?.data || []));

        // If edit mode, fetch reservation details
        if (isEditMode) {
          const reservation = await reservationService.getById(id);
          setFormData({
            client_id: reservation.client_id || '',
            serviceable_type: reservation.serviceable_type || 'package',
            serviceable_id: reservation.serviceable_id || '',
            date: reservation.date ? reservation.date.split('T')[0] : '',
            total_amount: reservation.total_amount || ''
          });
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        toast({ title: "Error", description: "Failed to load required data.", variant: "destructive" });
        navigate('/reservations');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDependencies();
  }, [isEditMode, id, navigate, toast]);

  const handleServiceableChange = (e) => {
    const selectedId = e.target.value;
    setFormData(prev => ({ ...prev, serviceable_id: selectedId }));

    // Optional: Auto-fill amount based on selection price
    let selectedItem = null;
    if (formData.serviceable_type === 'package') {
      selectedItem = packages.find(p => p.id.toString() === selectedId);
    } else {
      selectedItem = clothes.find(c => c.id.toString() === selectedId);
    }

    if (selectedItem && selectedItem.price) {
      setFormData(prev => ({ ...prev, total_amount: selectedItem.price }));
    }
  };

  const handleTypeChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      serviceable_type: e.target.value, 
      serviceable_id: '', // Reset selection on type change
      total_amount: '' // Reset amount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await reservationService.update(id, formData);
        toast({ title: "Success", description: "Reservation updated successfully." });
      } else {
        await reservationService.create(formData);
        toast({ title: "Success", description: "Reservation created successfully." });
      }
      navigate('/reservations');
    } catch (error) {
      console.error("Error saving reservation:", error);
      toast({ title: "Error", description: error.message || "Failed to save reservation.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Reservation' : 'New Reservation'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reservations"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Reservation' : 'New Reservation'}</h1>
          <p className="text-muted-foreground">Schedule a new service appointment.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          
          <div className="grid gap-2">
            <Label htmlFor="client_id">Client</Label>
            <select
              id="client_id"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.client_id}
              onChange={e => setFormData({...formData, client_id: e.target.value})}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name || client.email}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="grid gap-2">
               <Label htmlFor="serviceable_type">Service Type</Label>
               <select
                  id="serviceable_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.serviceable_type}
                  onChange={handleTypeChange}
                  required
                >
                  <option value="package">Package</option>
                  <option value="cloth">Clothing Item</option>
                </select>
             </div>

             <div className="grid gap-2">
               <Label htmlFor="serviceable_id">Select {formData.serviceable_type === 'package' ? 'Package' : 'Item'}</Label>
               <select
                  id="serviceable_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.serviceable_id}
                  onChange={handleServiceableChange}
                  required
                >
                  <option value="">Select Option</option>
                  {formData.serviceable_type === 'package' 
                    ? packages.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)
                    : clothes.map(c => <option key={c.id} value={c.id}>{c.name} {c.branch ? `(${c.branch})` : ''}</option>)
                  }
                </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_amount">Total Amount ($)</Label>
              <Input 
                id="total_amount" 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={formData.total_amount}
                onChange={e => setFormData({...formData, total_amount: e.target.value})}
                required 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/reservations">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
            Save Reservation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
