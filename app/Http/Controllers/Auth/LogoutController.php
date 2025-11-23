<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'Logout',
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
