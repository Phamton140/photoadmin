<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Package;
use App\Models\Cloth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * List all reservations (optionally filter by client, date, service type).
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['client', 'serviceable']);

        // filtro por cliente
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // filtro por rango de fechas
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        // filtro por tipo de servicio (Package o Cloth)
        if ($request->filled('serviceable_type')) {
            $type = $request->serviceable_type;
            // allow short names "package" or "cloth"
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
     * Store a new reservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'       => 'required|exists:clients,id',
            'serviceable_id'  => 'required|integer',
            'serviceable_type' => 'required|string', // expected values: "package" or "cloth"
            'date'            => 'required|date',
            'total_amount'    => 'nullable|numeric',
        ]);

        // Normalizar el tipo de modelo
        $type = strtolower($validated['serviceable_type']);
        if ($type === 'package') {
            $modelClass = Package::class;
        } elseif ($type === 'cloth') {
            $modelClass = Cloth::class;
        } else {
            return response()->json(['error' => 'Invalid serviceable_type'], 422);
        }
        $validated['serviceable_type'] = $modelClass;

        // Verificar que el recurso exista y esté disponible
        $service = $modelClass::find($validated['serviceable_id']);
        if (! $service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        // Para vestimentas, comprobar que el estado sea "available"
        if ($modelClass === Cloth::class && $service->status !== 'available') {
            return response()->json(['error' => 'Cloth not available'], 422);
        }
        // Para paquetes, podrías añadir lógica de disponibilidad (por ahora se permite siempre)

        $reservation = Reservation::create($validated);
        return response()->json($reservation, 201);
    }

    /**
     * Show a single reservation.
     */
    public function show($id)
    {
        $reservation = Reservation::with(['client', 'serviceable'])->findOrFail($id);
        return response()->json($reservation);
    }

    /**
     * Update a reservation (e.g., change date or status).
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $validated = $request->validate([
            'date'         => 'sometimes|date',
            'total_amount' => 'sometimes|numeric',
        ]);
        $reservation->update($validated);
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
     * Calendar endpoint for FullCalendar.
     * Returns reservations in FullCalendar format.
     */
    public function calendar(Request $request)
    {
        $query = Reservation::with(['client', 'serviceable']);

        // Filter by date range (FullCalendar sends start/end params)
        if ($request->filled('start')) {
            $query->where('date', '>=', $request->start);
        }
        if ($request->filled('end')) {
            $query->where('date', '<=', $request->end);
        }

        $reservations = $query->get();

        // Transform to FullCalendar format
        $events = $reservations->map(function ($reservation) {
            $serviceType = class_basename($reservation->serviceable_type);
            $serviceName = $reservation->serviceable->name ?? 'Unknown';

            return [
                'id'    => $reservation->id,
                'title' => "{$reservation->client->name} - {$serviceName}",
                'start' => $reservation->date,
                'end'   => $reservation->date, // you can calculate end based on duration
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
}
