<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory, HasUuids;

// Table name
    protected $table = 'events';
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

    protected $fillable = [
        'title',
        'date',
        'place_uuid'
    ];

    protected $casts = [
        'date' => 'datetime:d/m/Y',
    ];

    public static array $validation = [
        'title' => 'required|max:255|min:1',
        'date' => 'required|date_format:d/m/Y',
        'place_uuid' => ['required', 'uuid', 'exists:App\Models\Place,uuid'],
//        'teams' => 'array',
//        "teams.*"  => "exists:App\Models\Team,uuid",
    ];
    public static array $validationUpdate = [
        'title' => 'max:255|min:1',
        'date' => 'date_format:d/m/Y',
        'place_uuid' => ['uuid', 'exists:App\Models\Place,uuid'],
//        'teams' => 'array',
//        "teams.*"  => "exists:App\Models\Team,uuid",
    ];

    public static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }

    /**
     * Get the teams related to this event
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class, 'event_uuid');
    }
    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class, 'place_uuid');
    }

}
