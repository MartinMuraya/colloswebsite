<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        // Create default roles needed for registration
        Role::create(['name' => 'Customer']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Super Admin']);
    }

    public function test_user_can_register()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'jane.doe@example.com',
            'password' => Hash::make('securepassword'),
        ]);
        $user->assignRole('Customer');

        $payload = [
            'email' => 'jane.doe@example.com',
            'password' => 'securepassword',
        ];

        $response = $this->postJson('/api/auth/login', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'email'],
                     'token',
                     'roles'
                 ]);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $payload = [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/auth/login', $payload);

        $response->assertStatus(401)
                 ->assertJsonFragment(['message' => 'The provided credentials do not match our records.']);
    }
}
