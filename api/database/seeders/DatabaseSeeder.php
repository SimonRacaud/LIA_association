<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Database\UniqueConstraintViolationException;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        try {
            \App\Models\User::create([
                'username' => 'admin',
                'email' => 'simonracaud@gmail.com',
                'password' => bcrypt(env('ADMIN_USER_PASS')),
                'role' => UserRole::ADMIN,
            ]);
        } catch (UniqueConstraintViolationException $e) {
            dump("Seeder: admin user not created.", $e->getMessage());
        }
    }
}
