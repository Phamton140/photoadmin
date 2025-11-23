<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\Permission;
use App\Models\AuditLog;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        // Opcional: agregar branch_id si deseas relacionar el usuario con una sucursal
        // 'branch_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // ---------------------------------------------------------------------
    // RELACIONES
    // ---------------------------------------------------------------------

    // 1. Roles asignados al usuario (muchos a muchos)
    public function roles()
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    // 2. Permisos asignados directamente al usuario (muchos a muchos)
    public function directPermissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user')->withTimestamps();
    }

    // 3. Auditorías realizadas por el usuario
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    // ---------------------------------------------------------------------
    // PERMISOS CALCULADOS (Roles + Directos)
    // ---------------------------------------------------------------------

    /**
     * Retorna TODOS los permisos del usuario:
     * - Permisos de roles
     * - Permisos directos
     * Todo convertido en una colección de keys.
     */
    public function allPermissions()
    {
        return collect(
            $this->roles()
                ->with('permissions')
                ->get()
                ->pluck('permissions')
                ->flatten()
                ->merge($this->directPermissions()->get())
                ->unique('id')
                ->pluck('key')
        );
    }

    // ---------------------------------------------------------------------
    // VERIFICACIONES
    // ---------------------------------------------------------------------

    /**
     * Verifica si el usuario tiene un rol por nombre.
     */
    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Verifica si el usuario tiene un permiso (key).
     */
    public function hasPermission($key)
    {
        return $this->allPermissions()->contains($key);
    }

    // ---------------------------------------------------------------------
    // ASIGNACIÓN DE ROLES Y PERMISOS
    // ---------------------------------------------------------------------

    /**
     * Asignar rol sin quitar los que ya tiene.
     */
    public function assignRole($roleId)
    {
        $this->roles()->syncWithoutDetaching([$roleId]);
    }

    /**
     * Quitar rol específico.
     */
    public function removeRole($roleId)
    {
        $this->roles()->detach($roleId);
    }

    /**
     * Asignar permiso directo al usuario.
     */
    public function givePermission($permissionId)
    {
        $this->directPermissions()->syncWithoutDetaching([$permissionId]);
    }

    /**
     * Quitar permiso directo.
     */
    public function revokePermission($permissionId)
    {
        $this->directPermissions()->detach($permissionId);
    }
}
