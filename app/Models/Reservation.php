<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    protected $fillable = [
        'client_id',
        'serviceable_id',
        'serviceable_type',
        'date',
        'total_amount',
        'category',
        'paid_amount',
        'payment_status',
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

    /**
     * Services attached to this reservation (clothing or package).
     */
    public function reservationServices(): HasMany
    {
        return $this->hasMany(ReservationService::class);
    }
}
