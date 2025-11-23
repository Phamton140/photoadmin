<?php

namespace App\Http\Controllers;

use App\Models\ProductionTask;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class ProductionTaskController extends Controller
{
    public function index()
    {
        return response()->json(
            ProductionTask::with(['editor','project'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'editor_id'  => 'nullable|exists:users,id',
            'name'       => 'required|string',
            'status'     => 'in:pending,in_progress,review,completed,cancelled',
            'estimated_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $task = ProductionTask::create($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'create_production_task',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        $task = ProductionTask::findOrFail($id);

        $validated = $request->validate([
            'editor_id'  => 'nullable|exists:users,id',
            'name'       => 'required|string',
            'status'     => 'in:pending,in_progress,review,completed,cancelled',
            'estimated_minutes' => 'nullable|integer',
            'spent_minutes' => 'nullable|integer',
            'notes' => 'nullable|string',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
        ]);

        $task->update($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_production_task',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = ProductionTask::findOrFail($id);
        $task->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_production_task',
            'ip_address' => request()->ip(),
            'details' => json_encode(['task_id' => $id])
        ]);

        return response()->json(['message' => 'Tarea eliminada']);
    }
}
