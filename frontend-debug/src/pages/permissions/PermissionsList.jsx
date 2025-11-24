
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield, Eye } from 'lucide-react';
import { permissionService } from "@/services/api";

const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const data = await permissionService.getAll();
        setPermissions(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Permissions | Photoadmin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground">View system capabilities and access controls.</p>
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug / Key</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></TableCell></TableRow>
            ) : permissions.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No permissions found.</TableCell></TableRow>
            ) : (
              permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell className="font-medium flex items-center gap-2"><Shield className="h-3 w-3 text-muted-foreground" /> {perm.name}</TableCell>
                  <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{perm.slug || perm.key}</code></TableCell>
                  <TableCell>{perm.description || '-'}</TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="sm" asChild>
                        <Link to={`/permissions/${perm.id}/edit`}><Eye className="h-4 w-4" /></Link>
                     </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionsList;
