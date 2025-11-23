<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::orderBy('id','desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'phone'  => 'nullable|string|max:50',
            'email'  => 'nullable|email',
            'notes'  => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $validated['registered_at'] = now();

        $client = Client::create($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action'  => 'create_client',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($client, 201);
    }

    public function show($id)
    {
        return response()->json(Client::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'required|string',
            'phone'  => 'nullable|string',
            'email'  => 'nullable|email',
            'notes'  => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $client->update($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_client',
            'ip_address' => $request->ip(),
            'details' => json_encode($validated)
        ]);

        return response()->json($client);
    }

    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_client',
            'ip_address' => request()->ip(),
            'details' => json_encode(['client_id' => $id])
        ]);

        return response()->json(['message' => 'Cliente eliminado']);
    }
}
