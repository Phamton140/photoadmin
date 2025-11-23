<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class UserAccessController extends Controller
{
    // Obtener todos los permisos (roles + directos)
    public function getPermissions($userId)
    {
        $user = User::findOrFail($userId);

        return response()->json([
            'roles'       => $user->roles()->get(),
            'permissions' => $user->allPermissions()->values(),
        ]);
    }

    // Asignar un rol al usuario
    public function assignRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $data = $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user->assignRole($data['role_id']);

        return response()->json([
            'message' => 'Rol asignado correctamente',
            'roles'   => $user->roles()->get(),
        ]);
    }

    // Quitar un rol del usuario
    public function removeRole($userId, $roleId)
    {
        $user = User::findOrFail($userId);
        $role = Role::findOrFail($roleId);

        $user->removeRole($role->id);

        return response()->json([
            'message' => 'Rol removido correctamente',
            'roles'   => $user->roles()->get(),
        ]);
    }

    // Asignar permiso directo al usuario
    public function givePermission(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $data = $request->validate([
            'permission_id' => 'required|integer|exists:permissions,id',
        ]);

        $user->givePermission($data['permission_id']);

        return response()->json([
            'message'     => 'Permiso directo asignado',
            'permissions' => $user->allPermissions()->values(),
        ]);
    }

    // Quitar permiso directo del usuario
    public function revokePermission($userId, $permissionId)
    {
        $user = User::findOrFail($userId);
        $permission = Permission::findOrFail($permissionId);

        $user->revokePermission($permission->id);

        return response()->json([
            'message'     => 'Permiso directo removido',
            'permissions' => $user->allPermissions()->values(),
        ]);
    }
}
