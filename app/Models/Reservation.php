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
        'payment_method',
        'bank_code',
        'transfer_screenshot',
    ];

    protected $appends = ['transfer_screenshot_url'];

    /**
     * Get the full URL for the transfer screenshot.
     */
    public function getTransferScreenshotUrlAttribute()
    {
        return $this->transfer_screenshot ? url('storage/' . $this->transfer_screenshot) : null;
    }

    /**
     * Calcular automáticamente el payment_status basado en paid_amount.
     */
    public function updatePaymentStatus(): void
    {
        if ($this->paid_amount >= $this->total_amount) {
            $this->payment_status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'pending';
        }
        $this->save();
    }

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
