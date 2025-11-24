<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reservation extends Model
{
    protected $fillable = [
        'client_id',
        'serviceable_id',
        'serviceable_type',
        'date',
        'total_amount',
    ];

    /**
     * Client that made the reservation.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The service (Package or Cloth) that is reserved.
     */
    public function serviceable(): MorphTo
    {
        return $this->morphTo();
    }
}
