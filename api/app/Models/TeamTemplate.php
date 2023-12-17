<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

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

    public static array $validation = [
        'title' => 'required|max:255|unique:team_templates',
        'type' => 'required|in:RAMASSAGE,DISTRIB',
        'note' => 'required|max:255',
        'maxMember' => 'required|numeric'
    ];
    public static array $validationSoft = [
        'title' => 'max:255|unique:team_templates',
        'type' => 'in:RAMASSAGE,DISTRIB',
        'note' => 'max:255',
        'maxMember' => 'numeric'
    ];
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
