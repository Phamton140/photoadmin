
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const SERVICE_COLORS = {
  'Wedding': 'bg-yellow-500',
  'Portrait': 'bg-blue-500',
  'Event': 'bg-green-500',
  'Studio': 'bg-purple-500',
  'Other': 'bg-gray-500'
};

// Mock Data Generator
const generateMockReservations = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  return [
    { id: 1, date: new Date(year, month, 5), client: 'Alice Johnson', service: 'Wedding', status: 'Confirmed' },
    { id: 2, date: new Date(year, month, 12), client: 'Bob Smith', service: 'Portrait', status: 'Pending' },
    { id: 3, date: new Date(year, month, 12), client: 'Charlie Brown', service: 'Event', status: 'Confirmed' },
    { id: 4, date: new Date(year, month, 15), client: 'Diana Prince', service: 'Studio', status: 'Completed' },
    { id: 5, date: new Date(year, month, 22), client: 'Evan Wright', service: 'Portrait', status: 'Confirmed' },
    { id: 6, date: new Date(year, month, 28), client: 'Fiona Green', service: 'Wedding', status: 'Pending' },
    // Add one for "today" if within range
    { id: 7, date: new Date(), client: 'George King', service: 'Studio', status: 'Pending' }
  ];
};

const ReservationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [filterView, setFilterView] = useState('day'); // 'day', 'week', 'month'

  useEffect(() => {
    // Simulate fetching data for the displayed month
    setReservations(generateMockReservations(currentDate));
  }, [currentDate]);

  // Calendar Logic Helpers
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isSameWeek = (d1, d2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((d1 - d2) / oneDay));
    // Simplistic week check (within 7 days range basically for this demo, or proper week align)
    // Let's implement strict week (Sunday to Saturday)
    const d1Day = d1.getDay();
    const d1Start = new Date(d1);
    d1Start.setDate(d1.getDate() - d1Day);
    
    const d2Day = d2.getDay();
    const d2Start = new Date(d2);
    d2Start.setDate(d2.getDate() - d2Day);
    
    return isSameDay(d1Start, d2Start);
  };

  const isSameMonth = (d1, d2) => {
    return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // Filter Reservations based on view mode
  const getFilteredReservations = () => {
    return reservations.filter(res => {
      if (filterView === 'day') return isSameDay(res.date, selectedDate);
      if (filterView === 'week') return isSameWeek(res.date, selectedDate);
      if (filterView === 'month') return isSameMonth(res.date, selectedDate);
      return false;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border bg-gray-50/50 dark:bg-gray-900/20" />);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());
      
      const dayReservations = reservations.filter(r => isSameDay(r.date, date));

      days.push(
        <div 
          key={day} 
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-24 border p-2 cursor-pointer transition-colors hover:bg-accent relative group",
            isSelected && "bg-accent ring-2 ring-primary ring-inset",
            isToday && !isSelected && "bg-blue-50 dark:bg-blue-900/20"
          )}
        >
          <div className="flex justify-between items-start">
            <span className={cn(
              "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
              isToday ? "bg-primary text-primary-foreground" : "text-gray-700 dark:text-gray-300"
            )}>
              {day}
            </span>
          </div>
          
          <div className="mt-2 flex flex-wrap content-start gap-1">
            {dayReservations.map((res, idx) => (
              <div 
                key={idx} 
                className={cn("w-2.5 h-2.5 rounded-full", SERVICE_COLORS[res.service] || SERVICE_COLORS['Other'])}
                title={`${res.service}: ${res.client}`}
              />
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="space-y-6">
      
      {/* Calendar Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4 border-b">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-4">
               <CardTitle>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
               <div className="flex items-center bg-muted rounded-md p-0.5">
                 <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-7 w-7">
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date())} className="h-7 px-2 text-xs">
                   Today
                 </Button>
                 <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7">
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
             </div>
             
             {/* Legend */}
             <div className="hidden md:flex items-center gap-3 text-xs">
               {Object.entries(SERVICE_COLORS).map(([name, colorClass]) => (
                 <div key={name} className="flex items-center gap-1.5">
                   <span className={cn("w-2 h-2 rounded-full", colorClass)} />
                   <span>{name}</span>
                 </div>
               ))}
             </div>
           </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground py-2 border-b bg-gray-50 dark:bg-gray-900/50">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7">
            {renderCalendarGrid()}
          </div>
        </CardContent>
      </Card>

      {/* Filter & Details Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button 
              variant={filterView === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterView('day')}
              className="text-xs h-8"
            >
              Day View
            </Button>
            <Button 
              variant={filterView === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterView('week')}
              className="text-xs h-8"
            >
              Week View
            </Button>
            <Button 
              variant={filterView === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterView('month')}
              className="text-xs h-8"
            >
              Month View
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing reservations for: <span className="font-medium text-foreground">{
              filterView === 'day' ? selectedDate.toDateString() :
              filterView === 'week' ? `Week of ${selectedDate.toDateString()}` :
              `Month of ${selectedDate.toLocaleString('default', { month: 'long' })}`
            }</span>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No reservations found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {res.date.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{res.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", SERVICE_COLORS[res.service] || SERVICE_COLORS['Other'])} />
                        {res.service}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={res.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {res.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ReservationCalendar;
