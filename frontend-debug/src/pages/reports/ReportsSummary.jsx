
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { reportService } from "@/services/api";
import { Loader2, BarChart3 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ReportsSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reportService.getSummary();
        setData(res);
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
      <Helmet><title>Reports Summary | Photoadmin</title></Helmet>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports Overview</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild><Link to="/reports/branches">Projects by Branch</Link></Button>
          <Button variant="outline" asChild><Link to="/reports/productivity">Productivity</Link></Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.total_projects || 0}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.active_clients || 0}</div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (Est.)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data?.revenue || '0.00'}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsSummary;
