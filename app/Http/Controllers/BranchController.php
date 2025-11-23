<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class BranchController extends Controller
{
    public function index()
    {
        return response()->json(Branch::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'manager_name' => 'nullable|string',
            'status'   => 'required|in:active,inactive',
        ]);

        $branch = Branch::create($validated);

        // Registrar auditoría
        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => 'create_branch',
            'ip_address' => $request->ip(),
            'details'    => json_encode($validated)
        ]);

        return response()->json($branch, 201);
    }

    public function show($id)
    {
        return response()->json(Branch::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'manager_name' => 'nullable|string',
            'status'   => 'required|in:active,inactive',
        ]);

        $branch->update($validated);

        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => 'update_branch',
            'ip_address' => $request->ip(),
            'details'    => json_encode($validated)
        ]);

        return response()->json($branch);
    }

    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();

        AuditLog::create([
            'user_id'    => auth()->id(),
            'action'     => 'delete_branch',
            'ip_address' => request()->ip(),
            'details'    => json_encode(['branch_id' => $id])
        ]);

        return response()->json(['message' => 'Sucursal eliminada correctamente']);
    }
}
