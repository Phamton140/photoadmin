
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, User, Mail, Calendar, Shield, Key } from 'lucide-react';
import { userService } from "@/services/api";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getById(id);
        setUser(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load user details.", variant: "destructive" });
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate, toast]);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!user) return null;

  // Calculate direct permissions if backend provides them, otherwise fallback
  const permissions = user.permissions || user.all_permissions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Helmet><title>User Details | Photoadmin</title></Helmet>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/users"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">Detailed view of system user.</p>
        </div>
        <Button asChild>
          <Link to={`/users/${id}/edit`}>Edit User</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" /> Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <span className="text-lg">{user.name}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-3 w-3" /> Email Address
              </span>
              <span className="text-lg">{user.email}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Created At
              </span>
              <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Roles Card */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" /> Assigned Roles
          </h2>
          
          {user.roles && user.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.roles.map(role => (
                <span key={role.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {role.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No roles assigned.</p>
          )}
        </div>

        {/* Effective Permissions Card (spanning full width) */}
        <div className="col-span-full bg-white dark:bg-gray-950 rounded-lg border p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-500" /> Effective Permissions
          </h2>
          <p className="text-sm text-muted-foreground">
            These permissions are granted via assigned roles.
          </p>
          
          {permissions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {permissions.map((perm, index) => (
                <div key={perm.id || index} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                  <span className="font-medium text-sm">{perm.name}</span>
                  <code className="text-xs text-muted-foreground mt-1">{perm.key || perm.slug}</code>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No specific permissions found directly on this user object. 
              (Permissions might be derived dynamically from Roles on the backend).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;
