<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    /**
     * Uso en ruta:
     * ->middleware('permission:projects.view')
     * ->middleware('permission:projects.view|projects.update')
     */
    public function handle(Request $request, Closure $next, $permissions)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Permisos separados por |
        $permissions = array_map('trim', explode('|', $permissions));


        // Verificar si el usuario tiene 1 o más permisos válidos
        foreach ($permissions as $perm) {
            if ($user->hasPermission($perm)) {
                return $next($request);
            }
        }

        return response()->json([
            'error' => 'Acceso denegado: permiso insuficiente',
            'required_permissions' => $permissions,
        ], 403);
    }
}
