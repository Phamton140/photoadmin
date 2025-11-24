<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Cloth extends Model
{
    protected $table = 'clothes';

    protected $fillable = [
        'image',
        'name',
        'category_id',
        'subcategory_id',
        'branch_id',
        'price',
        'status',
    ];

    protected $appends = ['image_url'];

    /**
     * Get the full URL for the image.
     */
    public function getImageUrlAttribute()
    {
        return $this->image ? url('storage/' . $this->image) : null;
    }

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
     * Branch where the cloth is available.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Reservations for this cloth.
     */
    public function reservations(): MorphMany
    {
        return $this->morphMany(Reservation::class, 'serviceable');
    }
}
