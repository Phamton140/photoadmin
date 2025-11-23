
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { projectService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const ProjectForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    status: 'Active',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (location.state?.project) {
        const data = location.state.project;
        setFormData({
          name: data.name || '',
          client_id: data.client_id || '',
          status: data.status || 'Active',
          due_date: data.due_date || ''
        });
      } else {
        toast({ 
          title: "Data Missing", 
          description: "Project data not found. Please navigate from the Projects list.", 
          variant: "destructive" 
        });
        navigate('/projects');
      }
    }
  }, [isEditMode, location.state, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await projectService.update(id, formData);
      } else {
        await projectService.create(formData);
      }
      toast({ title: "Success", description: `Project ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/projects');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit Project' : 'Create Project'} | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Project' : 'New Project'}</h1>
          <p className="text-muted-foreground">Project details and timeline.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Summer Campaign" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
               <Label htmlFor="client_id">Client ID</Label>
               <Input 
                 id="client_id" 
                 value={formData.client_id}
                 onChange={e => setFormData({...formData, client_id: e.target.value})}
                 placeholder="Client ID" 
               />
             </div>
             <div className="grid gap-2">
               <Label htmlFor="status">Status</Label>
               <Input 
                 id="status" 
                 value={formData.status}
                 onChange={e => setFormData({...formData, status: e.target.value})}
                 placeholder="Active, Completed, etc." 
               />
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input 
              id="due_date" 
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({...formData, due_date: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/projects">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>
             {loading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
             Save Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
