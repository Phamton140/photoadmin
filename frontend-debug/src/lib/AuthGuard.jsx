import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { apiRequest } from "@/lib/api";
import { motion } from 'framer-motion';

const AuthGuard = ({ requiredPermission = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("userData") || "null");

    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }

    // Permisos del backend → user.permissions (array de strings)
    if (requiredPermission && !user.permissions.includes(requiredPermission)) {
      setHasPermission(false);
    }

    setIsLoading(false);
  }, [navigate, requiredPermission]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }}>
          Cargando...
        </motion.div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="p-20 text-center text-red-600 font-bold text-2xl">
        No tienes permiso para acceder aquí.
      </div>
    );
  }

  return <Outlet />;
};

export default AuthGuard;
