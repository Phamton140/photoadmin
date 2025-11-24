<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'subcategory_id',
        'description',
        'price',
        'duration',
        'duration_unit',
    ];

    /**
     * Category relationship.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Sub-category relationship (optional).
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    /**
     * Reservations made for this package.
     */
    public function reservations(): MorphMany
    {
        return $this->morphMany(Reservation::class, 'serviceable');
    }
}
