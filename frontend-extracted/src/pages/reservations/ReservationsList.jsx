
import React, { useState } from 'react';
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
  Calendar as CalendarIcon 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ReservationCalendar from './ReservationCalendar';

const ReservationsList = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  
  // Mock data for List View (Calendar has its own internal mock for now)
  const reservations = [
    { id: 1, date: '2024-03-15', time: '10:00 AM', client: 'John Doe', service: 'Portrait', branch: 'Main Branch', status: 'Confirmed' },
    { id: 2, date: '2024-03-16', time: '02:30 PM', client: 'Jane Smith', service: 'Wedding', branch: 'Downtown', status: 'Pending' },
  ];

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
                <TableHead>Date & Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" /> {res.date} {res.time}
                    </TableCell>
                    <TableCell>{res.client}</TableCell>
                    <TableCell>{res.service}</TableCell>
                    <TableCell>{res.branch}</TableCell>
                    <TableCell>
                      <Badge variant={res.status === 'Confirmed' ? 'default' : 'secondary'}>{res.status}</Badge>
                    </TableCell>
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
                          <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
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
    </div>
  );
};

export default ReservationsList;
