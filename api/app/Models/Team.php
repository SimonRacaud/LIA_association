<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory, HasUuids;

    // Table name
    protected $table = 'teams';
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
    public $timestamps = false;

    protected $fillable = [
        'template',
        'members'
    ];

    protected $casts = [];

    public static array $validation = [
        'template' => 'required|exists:App\Models\TeamTemplate,uuid',
        'members' => 'required|array|exists:App\Models\User,id',
    ];
    public static array $validationSoft = [
        'template' => 'required|exists:App\Models\TeamTemplate,uuid',
        'members' => 'required|array|exists:App\Models\User,id',
    ];

    public static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }

    /**
     * Get the template associated with the team.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(TeamTemplate::class, 'template_uuid');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_uuid');
    }
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'teams_users', 'team_uuid', 'user_id');
    }

}
