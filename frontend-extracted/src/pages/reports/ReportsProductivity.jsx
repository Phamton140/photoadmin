
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportService } from "@/services/api";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ReportsProductivity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reportService.getProductivity();
        setData(Array.isArray(res) ? res : res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Helmet><title>Reports: Productivity | Photoadmin</title></Helmet>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link to="/reports"><ArrowLeft className="h-4 w-4"/></Link></Button>
        <h1 className="text-3xl font-bold">Staff Productivity</h1>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tasks Completed</TableHead>
              <TableHead>Hours Logged</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
               <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="animate-spin inline" /></TableCell></TableRow>
             ) : data.length === 0 ? (
               <TableRow><TableCell colSpan={4} className="h-24 text-center">No data available.</TableCell></TableRow>
             ) : (
               data.map((row, idx) => (
                 <TableRow key={idx}>
                   <TableCell className="font-medium">{row.staff_name}</TableCell>
                   <TableCell>{row.role}</TableCell>
                   <TableCell>{row.tasks_completed}</TableCell>
                   <TableCell>{row.hours_logged}</TableCell>
                 </TableRow>
               ))
             )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsProductivity;
