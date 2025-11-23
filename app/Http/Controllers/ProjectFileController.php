<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\AuditLog;

class ProjectFileController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'file'       => 'required|file|max:2048000', // 2GB (si Hostinger lo permite)
            'type'       => 'required|in:raw,preview,final,other',
        ]);

        $path = $request->file('file')->store('projects', 'public');

        $file = ProjectFile::create([
            'project_id' => $validated['project_id'],
            'uploaded_by' => auth()->id(),
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
            'mime_type' => $request->file('file')->getMimeType(),
            'size_bytes' => $request->file('file')->getSize(),
            'type' => $validated['type'],
            'disk' => 'public'
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'upload_file',
            'ip_address' => $request->ip(),
            'details' => json_encode([
                'file' => $file->file_name,
                'project_id' => $validated['project_id']
            ])
        ]);

        return response()->json($file, 201);
    }
}
