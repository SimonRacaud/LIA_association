<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\HasApiTokens;

enum UserRole:string
{
    case MEMBER = 'MEMBRE';
    case ADMIN = 'ADMIN';
}

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'place_uuid',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'role' => UserRole::class,
    ];

    public static function validation() {
        return [
            'username' => ['required', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8'],
            'role' => ['required', Rule::in(array_column(UserRole::cases(), 'value'))],
            'place_uuid' => ['required', 'uuid', 'exists:App\Models\Place,uuid'],
        ];
    }

    public static function validationUpdate($id) {
        return [
            'username' => [Rule::unique('users')->ignore($id, 'id'), 'max:255'],
            'email' => ['email', Rule::unique('users')->ignore($id, 'id')],
            'password' => 'min:8',
            'role' => [Rule::in(array_column(UserRole::cases(), 'value'))],
            'place_uuid' => ['uuid', 'exists:App\Models\Place,uuid'],
        ];
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'teams_users', 'user_id', 'team_uuid');
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class, 'place_uuid');
    }
}
