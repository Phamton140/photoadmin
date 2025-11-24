<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'parent_id',
    ];

    /**
     * Sub‑categories (children).
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Parent category (optional).
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
}
