<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'manager_name',
        'status',
    ];

    // Relación: sucursal tiene muchos usuarios
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Relación: sucursal tiene muchos proyectos
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
