<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

enum TeamType:string
{
    case RAMASSAGE = 'RAMASSAGE';
    case DISTRIBUTION = 'DISTRIB';
}

class TeamTemplate extends Model
{
    use HasFactory, HasUuids;

    // Table name
    protected $table = 'team_templates';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'uuid';
    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'maxMember' => 0,
        'note' => '',
    ];

    protected $fillable = [
        'title',
        'type',
        'note',
        'maxMember'
    ];

    protected $casts = [
        'type' => TeamType::class
    ];

    public static function validation(): array
    {
        return [
            'title' => 'required|max:255|unique:team_templates',
            'type' => ['required', Rule::in(array_column(TeamType::cases(), 'value'))],
            'note' => 'max:255',
            'maxMember' => 'required|numeric'
        ];
    }
    public static function validationUpdate(string $uuid): array
    {
        return [
            'title' => ['max:255', Rule::unique('team_templates')->ignore($uuid, 'uuid')],
            'type' => [Rule::in(array_column(TeamType::cases(), 'value'))],
            'note' => 'max:255',
            'maxMember' => 'numeric'
        ];
    }
    public static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
}
