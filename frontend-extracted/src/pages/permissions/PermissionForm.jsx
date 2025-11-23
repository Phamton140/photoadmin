
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from 'lucide-react';
import { permissionService } from "@/services/api";

const PermissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/permissions');
      return;
    }

    permissionService.getById(id)
      .then(data => setFormData({
        name: data.name,
        slug: data.slug || data.key || '',
        description: data.description || ''
      }))
      .catch(err => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
        navigate('/permissions');
      })
      .finally(() => setFetching(false));
    
  }, [id, navigate, toast]);

  if (fetching) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>View Permission</title></Helmet>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/permissions"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold">View Permission</h1>
      </div>

      <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} readOnly className="bg-muted" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug / Key</Label>
          <Input id="slug" value={formData.slug} readOnly className="bg-muted" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={formData.description} readOnly className="bg-muted" />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild type="button"><Link to="/permissions">Back to List</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionForm;
