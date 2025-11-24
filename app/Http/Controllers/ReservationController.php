<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Package;
use App\Models\Cloth;
use App\Models\ReservationService;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    /**
     * List all reservations (optionally filter by client, date, service type).
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['client', 'serviceable']);

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('serviceable_type')) {
            $type = $request->serviceable_type;
            if (strtolower($type) === 'package') {
                $type = Package::class;
            } elseif (strtolower($type) === 'cloth') {
                $type = Cloth::class;
            }
            $query->where('serviceable_type', $type);
        }

        return response()->json($query->get());
    }

    /**
     * Store a new reservation with multiple services.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'       => 'required|exists:clients,id',
            'date'            => 'required|date',
            'category'        => 'required|string',
            'paid_amount'     => 'nullable|numeric',
            'total_amount'    => 'required|numeric',
            'payment_method'  => 'nullable|in:efectivo,transferencia,tarjeta',
            'bank_code'       => 'nullable|string',
            'services'        => 'required|array|min:1',
            'services.*.service_id'   => 'required|integer',
            'services.*.service_type' => 'required|in:clothing,package',
            'services.*.unit_price'   => 'required|numeric',
        ]);

        $reservation = Reservation::create([
            'client_id'      => $validated['client_id'],
            'date'           => $validated['date'],
            'category'       => $validated['category'],
            'paid_amount'    => $validated['paid_amount'] ?? 0,
            'total_amount'   => $validated['total_amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'bank_code'      => $validated['bank_code'] ?? null,
        ]);

        // Calcular payment_status automáticamente
        $reservation->updatePaymentStatus();

        foreach ($validated['services'] as $service) {
            ReservationService::create([
                'reservation_id' => $reservation->id,
                'service_id'     => $service['service_id'],
                'service_type'   => $service['service_type'],
                'unit_price'     => $service['unit_price'],
            ]);
        }

        AuditLog::create([
            'user_id'  => $request->user()->id ?? null,
            'action'   => 'create_reservation',
            'model'    => Reservation::class,
            'model_id' => $reservation->id,
            'changes'  => json_encode($validated),
        ]);

        return response()->json($reservation, 201);
    }

    /**
     * Show a single reservation with its services.
     */
    public function show($id)
    {
        $reservation = Reservation::with(['client', 'serviceable', 'reservationServices'])->findOrFail($id);
        return response()->json($reservation);
    }

    /**
     * Update reservation fields.
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $original = $reservation->getOriginal();

        $validated = $request->validate([
            'date'            => 'sometimes|date',
            'category'        => 'sometimes|string',
            'paid_amount'     => 'sometimes|numeric',
            'total_amount'    => 'sometimes|numeric',
            'payment_method'  => 'sometimes|in:efectivo,transferencia,tarjeta',
            'bank_code'       => 'sometimes|string',
        ]);

        $reservation->update($validated);

        // Recalcular payment_status si cambió paid_amount o total_amount
        if (isset($validated['paid_amount']) || isset($validated['total_amount'])) {
            $reservation->updatePaymentStatus();
        }

        $changed = [];
        foreach ($validated as $key => $value) {
            if (array_key_exists($key, $original) && $original[$key] != $value) {
                $changed[$key] = ['old' => $original[$key], 'new' => $value];
            }
        }

        if (!empty($changed)) {
            AuditLog::create([
                'user_id'  => $request->user()->id ?? null,
                'action'   => 'update_reservation',
                'model'    => Reservation::class,
                'model_id' => $reservation->id,
                'changes'  => json_encode($changed),
            ]);
        }

        return response()->json($reservation);
    }

    /**
     * Delete a reservation.
     */
    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json(null, 204);
    }

    /**
     * Get all reservations for a specific client.
     */
    public function clientReservations($clientId)
    {
        $reservations = Reservation::with(['serviceable', 'reservationServices'])
            ->where('client_id', $clientId)
            ->get();
        return response()->json($reservations);
    }

    /**
     * Calendar endpoint for FullCalendar.
     */
    public function calendar(Request $request)
    {
        $query = Reservation::with(['client', 'serviceable']);

        if ($request->filled('start')) {
            $query->where('date', '>=', $request->start);
        }
        if ($request->filled('end')) {
            $query->where('date', '<=', $request->end);
        }

        $reservations = $query->get();

        $events = $reservations->map(function ($reservation) {
            $serviceType = class_basename($reservation->serviceable_type);
            $serviceName = $reservation->serviceable->name ?? 'Unknown';

            return [
                'id'    => $reservation->id,
                'title' => "{$reservation->client->name} - {$serviceName}",
                'start' => $reservation->date,
                'end'   => $reservation->date,
                'extendedProps' => [
                    'client_id'   => $reservation->client_id,
                    'client_name' => $reservation->client->name,
                    'service_type' => $serviceType,
                    'service_name' => $serviceName,
                    'total_amount' => $reservation->total_amount,
                ],
            ];
        });

        return response()->json($events);
    }

    /**
     * Upload transfer screenshot for a reservation.
     */
    public function uploadTransferScreenshot(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $validated = $request->validate([
            'transfer_screenshot' => 'required|image|max:10240', // Max 10MB
        ]);

        // Eliminar captura anterior si existe
        if ($reservation->transfer_screenshot && Storage::disk('public')->exists($reservation->transfer_screenshot)) {
            Storage::disk('public')->delete($reservation->transfer_screenshot);
        }

        // Guardar nueva captura
        $path = $request->file('transfer_screenshot')->store('transfers', 'public');
        $reservation->transfer_screenshot = $path;
        $reservation->save();

        // Audit log
        AuditLog::create([
            'user_id'  => $request->user()->id ?? null,
            'action'   => 'upload_transfer_screenshot',
            'model'    => Reservation::class,
            'model_id' => $reservation->id,
            'changes'  => json_encode(['screenshot' => $path]),
        ]);

        return response()->json([
            'message' => 'Captura de transferencia subida exitosamente',
            'reservation' => $reservation,
        ]);
    }

    /**
     * Search reservations by bank code.
     */
    public function searchByBankCode($code)
    {
        $reservations = Reservation::with(['client', 'serviceable', 'reservationServices'])
            ->where('bank_code', $code)
            ->get();

        return response()->json($reservations);
    }
}
