<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer', 'guard_name' => 'web']);

        // Create general permissions (optional for now, mainly focusing on roles)
        Permission::firstOrCreate(['name' => 'manage roles', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage users', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage products', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'manage orders', 'guard_name' => 'web']);

        // Assign permissions to Super Admin
        $superAdminRole->syncPermissions(Permission::all());

        // Assign specific permissions to Admin
        $adminRole->syncPermissions(['manage products', 'manage orders']);
    }
}
