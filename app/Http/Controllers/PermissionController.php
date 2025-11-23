<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    // GET /permissions
    public function index(Request $request)
    {
        $query = Permission::query();

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }

        return response()->json($query->get());
    }

    // POST /permissions
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'   => 'required|string|max:255|unique:permissions,name',
            'key'    => 'required|string|max:255|unique:permissions,key',
            'module' => 'required|string|max:255',
        ]);

        $permission = Permission::create($data);

        return response()->json($permission, 201);
    }

    // GET /permissions/{id}
    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json($permission);
    }

    // PUT /permissions/{id}
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $data = $request->validate([
            'name'   => 'sometimes|required|string|max:255|unique:permissions,name,' . $permission->id,
            'key'    => 'sometimes|required|string|max:255|unique:permissions,key,' . $permission->id,
            'module' => 'sometimes|required|string|max:255',
        ]);

        $permission->update($data);

        return response()->json($permission);
    }

    // DELETE /permissions/{id}
    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente']);
    }
}
