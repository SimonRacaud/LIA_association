<?php

namespace Database\Factories;

use App\Models\Place;
use App\Models\TeamTemplate;
use App\Models\TeamType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeamTemplate>
 */
class TeamTemplateFactory extends Factory
{

    protected $model = TeamTemplate::class;
    protected $placeUuid = "";

    /**
     * Configure the model factory.
     */

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $placeAllonnes = Place::findByLabel("Allonnes");

        return [
            "title" => fake()->uuid(),
            "type" => TeamType::RAMASSAGE,
            "note" => fake()->text(10),
            "maxMember" => fake()->numberBetween(0, 10),
            "place_uuid" => $placeAllonnes->uuid,
        ];
    }
}
