<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'roles' => 'array'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // Asignar roles si existen
        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        // Auditoría
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Creó al usuario {$user->email}",
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'user' => $user->load('roles')
        ], 201);
    }

    public function show($id)
    {
        return User::with('roles')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => "required|email|unique:users,email,$id",
            'roles' => 'array'
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            // Si llegó password, la actualiza
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);


        // Actualizar roles
        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        // Auditoría
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Actualizó al usuario {$user->email}",
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user->load('roles')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $email = $user->email;

        $user->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Eliminó al usuario {$email}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
