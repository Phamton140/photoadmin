<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Uso en rutas:
     *
     * ->middleware('role:Admin')
     * ->middleware('role:Admin|SuperAdmin')
     * ->middleware('role:Admin|Supervisor|Empleado')
     */
    public function handle(Request $request, Closure $next, $roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'No autenticado'
            ], 401);
        }

        // Soporta múltiples roles separados por "|"
        $rolesArray = array_map('trim', explode('|', $roles));


        // Verificar si el usuario tiene alguno de los roles
        if ($user->roles()->whereIn('name', $rolesArray)->exists()) {
            return $next($request);
        }

        return response()->json([
            'error' => 'Acceso denegado (rol insuficiente)',
            'required_roles' => $rolesArray
        ], 403);
    }
}