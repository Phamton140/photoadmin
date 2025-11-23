
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from 'lucide-react';
import { userService, roleService } from "@/services/api";

const UserForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  // originalRoles removed as we now sync roles via the main user endpoint

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const rolesResponse = await roleService.getAll();
        const rolesList = Array.isArray(rolesResponse) ? rolesResponse : (rolesResponse.data || []);
        setAvailableRoles(rolesList);

        if (isEditMode) {
          const userData = await userService.getById(id);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            password: '', 
            confirmPassword: ''
          });
          const currentRoleIds = userData.roles ? userData.roles.map(r => r.id) : [];
          setSelectedRoles(currentRoleIds);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
        if (isEditMode) navigate('/users');
      } finally {
        setInitialLoading(false);
      }
    };
    initData();
  }, [id, isEditMode, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) return prev.filter(id => id !== roleId);
      return [...prev, roleId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode && !formData.password) {
      toast({ title: "Validation Error", description: "Password is required for new users", variant: "destructive" });
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        name: formData.name, 
        email: formData.email,
        roles: selectedRoles // Sending roles array directly in payload
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.confirmPassword;
      }

      if (isEditMode) {
        await userService.update(id, payload);
      } else {
        await userService.create(payload);
      }

      toast({ title: "Success", description: `User ${isEditMode ? 'updated' : 'created'} successfully.` });
      navigate('/users');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Helmet><title>{isEditMode ? 'Edit User' : 'Create User'} | Photoadmin</title></Helmet>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/users"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit User' : 'Create New User'}</h1>
          <p className="text-muted-foreground">{isEditMode ? 'Update user details and role assignments.' : 'Fill in the information to create a new system user.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Security</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="password">{isEditMode ? 'New Password (optional)' : 'Password'}</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Leave blank to keep current" : "********"} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="********" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium">Role Assignment</h3>
            <span className="text-xs text-muted-foreground">{selectedRoles.length} selected</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md border p-4 max-h-60 overflow-y-auto">
            {availableRoles.length === 0 ? <p className="text-sm text-center py-4">No roles available.</p> : (
              <div className="grid sm:grid-cols-2 gap-3">
                {availableRoles.map(role => (
                  <div key={role.id} className="flex items-start space-x-3 p-2 rounded hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <Checkbox id={`role-${role.id}`} checked={selectedRoles.includes(role.id)} onCheckedChange={() => handleRoleToggle(role.id)} />
                    <div className="grid gap-1 leading-none">
                      <Label htmlFor={`role-${role.id}`} className="cursor-pointer font-medium text-sm">{role.name}</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild type="button"><Link to="/users">Cancel</Link></Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isEditMode ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
