
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { auditService } from "@/services/api";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, last_page: 1 });
  const { toast } = useToast();

  const fetchLogs = async (pageNum) => {
    setLoading(true);
    try {
      const data = await auditService.getAll({ page: pageNum, per_page: 50 });
      
      let logsList = [];
      let total = 0;
      let lastPage = 1;

      if (data.data && Array.isArray(data.data)) {
        logsList = data.data;
        total = data.total || 0;
        lastPage = data.last_page || 1;
      } else if (Array.isArray(data)) {
        logsList = data;
        total = data.length;
        lastPage = 1;
      }

      setLogs(logsList);
      setPagination({
        total,
        last_page: lastPage,
        current_page: pageNum
      });

    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Could not load audit logs.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <Helmet><title>Audit Logs | Photoadmin</title></Helmet>
      
      <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
      <p className="text-muted-foreground">Track system activities and security events.</p>

      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading audit logs...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground h-24">No logs found.</TableCell></TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user_name || log.user?.name || 'System'}</TableCell>
                  <TableCell>{log.user_email || log.user?.email || '-'}</TableCell>
                  <TableCell><span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{log.action || log.event}</span></TableCell>
                  <TableCell className="font-mono text-xs">{log.ip_address || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground" title={log.details || JSON.stringify(log.properties)}>
                    {log.details || JSON.stringify(log.properties || {})}
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="text-sm font-medium">Page {page} of {pagination.last_page}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
          disabled={page >= pagination.last_page || loading}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AuditLog;
