<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Client;
use App\Models\Branch;
use App\Models\Project;
use App\Models\ProductionTask;

class ReportController extends Controller
{
    // KPIs principales del dashboard
    public function summary()
    {
        return response()->json([
            'total_users'     => User::count(),
            'total_clients'   => Client::count(),
            'projects_active' => Project::where('status','in_progress')->count(),
            'projects_month'  => Project::whereMonth('created_at', now()->month)->count(),
        ]);
    }

    public function projectsByBranch()
    {
        return response()->json(
            Branch::withCount('projects')->get()
        );
    }

    public function productivity()
    {
        return response()->json(
            User::withCount('auditLogs')->get()
        );
    }
}
