<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role;
use App\Models\Permission;

class ShowPermissions extends Command
{
    protected $signature = 'permissions:show';
    protected $description = 'Show all permissions and their role assignments';

    public function handle()
    {
        $this->info('=== PERMISSIONS IN DATABASE ===');
        $permissions = Permission::all();

        $this->table(
            ['ID', 'Name', 'Key', 'Module'],
            $permissions->map(function ($p) {
                return [$p->id, $p->name, $p->key, $p->module];
            })
        );

        $this->info("\n=== ROLE PERMISSIONS ===");
        $roles = Role::with('permissions')->get();

        foreach ($roles as $role) {
            $this->info("\n{$role->name}:");
            if ($role->permissions->count() > 0) {
                foreach ($role->permissions as $perm) {
                    $this->line("  - {$perm->key} ({$perm->name})");
                }
            } else {
                $this->warn("  No permissions assigned");
            }
        }

        return 0;
    }
}
