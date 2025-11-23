
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';

const ReservationForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;

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

      <div className="space-y-8 bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            {/* In a real app this would be a Select/Combobox */}
            <Input id="client" placeholder="Search client name..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Input id="service" placeholder="Select service..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="branch">Branch Location</Label>
            <Input id="branch" placeholder="Select branch..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" placeholder="Pending" defaultValue="Pending" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" asChild><Link to="/reservations">Cancel</Link></Button>
          <Button>Create Reservation</Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
