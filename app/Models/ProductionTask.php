<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionTask extends Model
{
    protected $fillable = [
        'project_id',
        'editor_id',
        'name',
        'status',
        'started_at',
        'finished_at',
        'estimated_minutes',
        'spent_minutes',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'editor_id');
    }
}
