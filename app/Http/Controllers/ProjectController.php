<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(
            Project::with(['client','branch','responsible'])->orderBy('id','desc')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'  => 'required|exists:clients,id',
            'branch_id'  => 'nullable|exists:branches,id',
            'responsible_id' => 'nullable|exists:users,id',

            'title'      => 'required|string|max:255',
            'type'       => 'nullable|string',
            'session_date' => 'nullable|date',
            'estimated_delivery_date' => 'nullable|date',
            'priority' => 'nullable|integer|min:1|max:10',

            'internal_notes' => 'nullable|string',
            'status' => 'in:pending,in_progress,delivered,cancelled',
        ]);

        $project = Project::create($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'create_project',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($project, 201);
    }

    public function show($id)
    {
        return response()->json(
            Project::with(['client','branch','responsible','productionTasks','files'])
                ->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'client_id'  => 'required|exists:clients,id',
            'branch_id'  => 'nullable|exists:branches,id',
            'responsible_id' => 'nullable|exists:users,id',

            'title'      => 'required|string|max:255',
            'type'       => 'nullable|string',
            'session_date' => 'nullable|date',
            'estimated_delivery_date' => 'nullable|date',
            'delivered_at' => 'nullable|date',

            'internal_notes' => 'nullable|string',
            'status' => 'in:pending,in_progress,delivered,cancelled',
        ]);

        $project->update($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_project',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_project',
            'ip_address' => request()->ip(),
            'details' => json_encode(['project_id' => $id])
        ]);

        return response()->json(['message' => 'Proyecto eliminado']);
    }
}
