<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationService extends Model
{
    protected $table = 'reservation_services';

    protected $fillable = [
        'reservation_id',
        'service_id',
        'service_type', // 'clothing' or 'package'
        'unit_price',
    ];

    /**
     * The reservation this service belongs to.
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * The actual service model (Cloth or Package).
     */
    public function serviceable()
    {
        return $this->morphTo(null, 'service_type', 'service_id');
    }
}
