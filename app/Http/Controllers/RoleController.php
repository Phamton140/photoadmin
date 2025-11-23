<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::with('permissions')->get();
    }

    public function show($id)
    {
        return Role::with('permissions')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['permissions'])) {
            $role->permissions()->sync($data['permissions']);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role->update([
            'name'        => $data['name'] ?? $role->name,
            'description' => $data['description'] ?? $role->description,
        ]);

        if (array_key_exists('permissions', $data)) {
            $role->permissions()->sync($data['permissions'] ?? []);
        }

        return response()->json($role->load('permissions'));
    }

    public function destroy($id)
    {
        Role::findOrFail($id)->delete();
        return response()->json(['message' => 'Rol eliminado correctamente']);
    }

    public function assignPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $data = $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $role->permissions()->syncWithoutDetaching($data['permissions']);

        return response()->json($role->load('permissions'));
    }

    public function removePermission($id, $permissionId)
    {
        $role = Role::findOrFail($id);

        $role->permissions()->detach($permissionId);

        return response()->json($role->load('permissions'));
    }
}
