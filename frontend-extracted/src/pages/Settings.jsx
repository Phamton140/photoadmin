
import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Settings | Photoadmin</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage global application preferences.</p>
      </div>
      
      <Separator />

      <div className="grid gap-8">
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium">General Information</h3>
            <p className="text-sm text-muted-foreground">Basic configuration for the platform.</p>
          </div>
          <div className="grid gap-4 max-w-xl">
            <div className="grid gap-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input id="appName" defaultValue="Photoadmin Panel" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@photoadmin.com" />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Irreversible actions.</p>
          </div>
          <div className="border border-red-200 bg-red-50 dark:bg-red-950/10 p-4 rounded-md flex items-center justify-between">
             <div>
               <h4 className="font-medium text-red-900 dark:text-red-200">Clear Cache</h4>
               <p className="text-sm text-red-700 dark:text-red-300">Remove all local temporary data.</p>
             </div>
             <Button variant="destructive" size="sm">Clear Cache</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
