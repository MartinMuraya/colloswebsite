<?php

namespace App\Modules\Auth\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name'
        ]);

        $user = User::findOrFail($id);
        
        // Prevent removing the only Super Admin
        if ($user->hasRole('Super Admin') && User::role('Super Admin')->count() === 1 && $request->role !== 'Super Admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot change the role of the only Super Admin.'
            ], 403);
        }

        // Only Super Admins can assign other Super Admins
        if ($request->role === 'Super Admin' && !auth()->user()->hasRole('Super Admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to assign Super Admin role.'
            ], 403);
        }

        $user->syncRoles([$request->role]);

        return response()->json([
            'status' => 'success',
            'message' => 'User role updated successfully.',
            'data' => $user->load('roles')
        ]);
    }

    public function getRoles()
    {
        $roles = Role::all();
        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }
}
