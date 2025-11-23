<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'client_id',
        'branch_id',
        'responsible_id',
        'title',
        'type',
        'session_date',
        'estimated_delivery_date',
        'delivered_at',
        'status',
        'internal_notes',
        'priority',
    ];

    protected $casts = [
        'session_date' => 'datetime',
        'estimated_delivery_date' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible_id');
    }

    public function productionTasks()
    {
        return $this->hasMany(ProductionTask::class);
    }

    public function files()
    {
        return $this->hasMany(ProjectFile::class);
    }
}
