<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {

            AuditLog::create([
                'user_id' => $user->id ?? null,
                'action' => 'Intento de login fallido',
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        // Crear token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Roles sin conflicto SQL
        $roles = $user->roles()
            ->select('roles.id', 'roles.name', 'roles.description')
            ->get();

        // Permisos calculados
        $permissions = $user->allPermissions()->values();

        // Auditoría
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'Login exitoso',
            'ip_address' => $request->ip(),
        ]);

        // Respuesta final
        return response()->json([
            'token' => $token,
            'user'  => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'roles'       => $roles,
                'permissions' => $permissions,
            ]
        ]);
    }
}
