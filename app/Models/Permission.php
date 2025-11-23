<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ['name', 'key', 'module'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'permission_role')->withTimestamps();
    }


    public function users()
    {
        return $this->belongsToMany(User::class, 'permission_user')->withTimestamps();
    }
}
