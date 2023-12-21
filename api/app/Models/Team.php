<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
        'template_uuid',
        'event_uuid'
    ];

    protected $casts = [];

    public static function validation(): array
    {
        return [
            'event_uuid' => ['required', 'exists:App\Models\Event,uuid'],
            'template_uuid' => [
                'required',
                'exists:App\Models\TeamTemplate,uuid'
            ],
            'members_add' => 'array',
            "members_add.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
            'members_rm' => 'array',
            "members_rm.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
        ];
    }
    public static function validationUnique(string $eventUuid, string $teamUuid = ''): array
    {
        return [
            'template_uuid' => [Rule::unique('teams')
                ->where(fn (Builder $query) => $query->where('event_uuid', $eventUuid))
                ->ignore($teamUuid, 'uuid')
            ],

        ];
    }

    public static function validationUpdate(): array
    {
        return [
            'template_uuid' => ['exists:App\Models\TeamTemplate,uuid'],
            'event_uuid' => 'exists:App\Models\Event,uuid',
            'members_add' => 'array',
            "members_add.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
            'members_rm' => 'array',
            "members_rm.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
        ];
    }

    /**
     * Endpoint is accessed by non-admin users: subscribe / unsubscribe users
     * @return array
     */
    public static function validationUpdateMembers(): array
    {
        return [
            'members_add' => 'array',
            "members_add.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
            'members_rm' => 'array',
            "members_rm.*" => [
                "exists:App\Models\User,id",
                "distinct"
            ],
        ];
    }

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
        return $this->belongsToMany(User::class, 'teams_users', 'team_uuid', 'user_id')
            ->as('members');
    }

}
