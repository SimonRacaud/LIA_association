<?php

namespace App\Models;

use Database\Factories\PlaceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class Place extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'places';

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'label'
    ];

    /// ---

    public static array $validation = [
        'label' => ['required', 'max:255', 'unique:places', 'min:1', 'string']
    ];

    public static function validationUpdate(string $uuid): array
    {
        return [
            'label' => ['max:255', Rule::unique('places')->ignore($uuid, 'uuid'),  'min:1', 'string'],
        ];
    }

    public static function booted(): void
    {
        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }

    public static function findByLabel(string $label)
    {
        return Place::where("label", $label)->firstOrFail();
    }

    protected static function newFactory()
    {
        return PlaceFactory::new();
    }
}
