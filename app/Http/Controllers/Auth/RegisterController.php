<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\AuditLog;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|min:6'
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password)
        ]);

        AuditLog::create([
            'user_id'   => $user->id,
            'action'    => 'Usuario registrado',
            'ip_address'=> $request->ip(),
            'details'   => json_encode([
                'email' => $user->email
            ])
        ]);

        return response()->json(['message' => 'Usuario creado correctamente'], 201);
    }
}
