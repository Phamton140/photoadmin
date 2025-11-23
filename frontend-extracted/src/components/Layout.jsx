
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  History, 
  LogOut, 
  Store, 
  CalendarDays, 
  Contact, 
  Package,
  Settings as SettingsIcon,
  Briefcase,
  Factory,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { authService } from "@/services/api";

const navItems = [
  { to: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'users', icon: Users, label: 'Users' },
  { to: 'roles', icon: Shield, label: 'Roles' },
  // Permissions item removed as requested
  { to: 'branches', icon: Store, label: 'Branches' },
  { to: 'reservations', icon: CalendarDays, label: 'Reservations' },
  { to: 'clients', icon: Contact, label: 'Clients' },
  { to: 'projects', icon: Briefcase, label: 'Projects' },
  { to: 'production', icon: Factory, label: 'Production' },
  { to: 'services', icon: Package, label: 'Services' },
  { to: 'reports', icon: BarChart3, label: 'Reports' },
  { to: 'audit', icon: History, label: 'Audit Log' },
  { to: 'settings', icon: SettingsIcon, label: 'Settings' },
];

const Layout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      toast({
        title: 'Sesión Cerrada',
        description: 'Has cerrado sesión exitosamente.',
      });
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full overflow-y-auto z-10">
        <div className="p-6 shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Photoadmin</h1>
        </div>
        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary dark:text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
