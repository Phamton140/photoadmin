
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { userService } from "@/services/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      const usersList = Array.isArray(data) ? data : (data.data || []);
      setUsers(usersList);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await userService.delete(deleteUserId);
      toast({ title: "Success", description: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    } finally {
      setDeleteUserId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUniqueRoles = (roles) => {
    if (!roles || roles.length === 0) return null;
    return Array.from(new Set(roles.map(r => r.name))).join(', ');
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Users Management | Photoadmin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage system users and their roles.</p>
        </div>
        <Button asChild>
          <Link to="/users/create"><Plus className="mr-2 h-4 w-4" /> Add User</Link>
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><div className="flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading users...</div></TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No users found.</TableCell></TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getUniqueRoles(user.roles) || <span className="text-muted-foreground italic">No roles</span>}</TableCell>
                  <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link to={`/users/${user.id}`} className="cursor-pointer"><Eye className="mr-2 h-4 w-4" /> View Details</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link to={`/users/${user.id}/edit`} className="cursor-pointer"><Pencil className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setDeleteUserId(user.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog 
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        description="Are you sure? This will permanently delete the user account."
      />
    </div>
  );
};

export default UsersList;
