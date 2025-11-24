
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  CalendarDays, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  List as ListIcon, 
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ReservationCalendar from './ReservationCalendar';
import { reservationService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import ConfirmDialog from "@/components/ConfirmDialog";

const ReservationsList = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getAll();
      setReservations(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error("Failed to fetch reservations", error);
      toast({ title: "Error", description: "Could not load reservations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await reservationService.delete(deleteId);
      toast({ title: "Success", description: "Reservation deleted successfully" });
      fetchReservations();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Reservations | Photoadmin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">View and manage upcoming bookings.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-lg flex items-center">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <ListIcon className="w-4 h-4 mr-2" /> List
            </Button>
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="h-8 px-3"
            >
              <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
            </Button>
          </div>
          <Button asChild size="sm">
            <Link to="/reservations/create"><Plus className="mr-2 h-4 w-4" /> New Reservation</Link>
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <ReservationCalendar />
      ) : (
        <div className="rounded-md border bg-white dark:bg-gray-950">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></TableCell></TableRow>
              ) : reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" /> 
                      {res.date ? new Date(res.date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{res.client_id}</TableCell>
                    <TableCell className="capitalize">
                      {res.serviceable_type} (ID: {res.serviceable_id})
                    </TableCell>
                    <TableCell>${res.total_amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/reservations/${res.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setDeleteId(res.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <ConfirmDialog 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Cancel Reservation"
        description="Are you sure you want to cancel this reservation? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ReservationsList;
