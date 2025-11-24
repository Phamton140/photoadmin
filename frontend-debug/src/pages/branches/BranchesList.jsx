
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal, Plus, Loader2, Store, Pencil, Trash2, Phone, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { branchService } from "@/services/api";
import ConfirmDialog from "@/components/ConfirmDialog";

const BranchesList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAll();
      // Handle both array response or { data: [...] } response
      setBranches(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await branchService.delete(deleteId);
      toast({ title: "Success", description: "Branch deleted successfully" });
      fetchBranches();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Branches | Photoadmin</title></Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage branch locations and details.</p>
        </div>
        <Button asChild>
          <Link to="/branches/create"><Plus className="mr-2 h-4 w-4" /> Add Branch</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></TableCell></TableRow>
            ) : branches.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No branches found.</TableCell></TableRow>
            ) : (
              branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" /> {branch.name}
                  </TableCell>
                  <TableCell>{branch.address || '-'}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {branch.phone ? (
                      <><Phone className="h-3 w-3 text-gray-400" /> {branch.phone}</>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {branch.manager ? (
                      <div className="flex items-center gap-2">
                         <User className="h-3 w-3 text-gray-400" />
                         {branch.manager}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/branches/${branch.id}/edit`} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setDeleteId(branch.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Branch"
        description="Are you sure you want to delete this branch? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BranchesList;
