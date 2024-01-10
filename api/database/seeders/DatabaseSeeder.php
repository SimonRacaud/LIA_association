<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\TeamTemplate;
use App\Models\TeamType;
use App\Models\UserRole;
use Illuminate\Database\QueryException;
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
        try {
            TeamTemplate::updateOrCreate([
                "title" => "Leclerc sablé / Super U Arnage",
                "type" => TeamType::RAMASSAGE,
                "note" => "9876 A",
                "maxMember" => 2
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Carrefour Sud / La Pointe",
                "type" => TeamType::RAMASSAGE,
                "note" => "02.43.67.30.96 / 2312 (V)",
                "maxMember" => 2
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "U express bollée",
                "type" => TeamType::RAMASSAGE,
                "note" => "02.43.84.57.61",
                "maxMember" => 1
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Leclerc Fontenelle Drive / Super U Bonnétable",
                "type" => TeamType::RAMASSAGE,
                "note" => "1234 / 2312 (V)",
                "maxMember" => 2
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Utile / St George du bois",
                "type" => TeamType::RAMASSAGE,
                "note" => "2312 (v)",
                "maxMember" => 1
            ]);
            // Distribution
            TeamTemplate::updateOrCreate([
                "title" => "Accueil / Pain",
                "type" => TeamType::DISTRIBUTION,
                "note" => "10h - 14h, au local",
                "maxMember" => 1
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Frais / Viennoiseries",
                "type" => TeamType::DISTRIBUTION,
                "note" => "10h - 14h, au local",
                "maxMember" => 2
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Fruits",
                "type" => TeamType::DISTRIBUTION,
                "note" => "10h - 14h, au local",
                "maxMember" => 1
            ]);
            TeamTemplate::updateOrCreate([
                "title" => "Légumes",
                "type" => TeamType::DISTRIBUTION,
                "note" => "10h - 14h, au local",
                "maxMember" => 2
            ]);
        } catch (QueryException $e) {
            dump("Seeded: templates not created", $e->getMessage());
        }
    }
}
