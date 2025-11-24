<?php

namespace App\Http\Controllers;

use App\Models\Cloth;
use App\Models\Category;
use App\Models\Branch;
use Illuminate\Http\Request;

class ClothController extends Controller
{
    /**
     * List all clothes.
     */
    public function index()
    {
        return response()->json(
            Cloth::with(['category', 'subcategory', 'branch'])->get()
        );
    }

    /**
     * Store a new cloth.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image'          => 'nullable|image|max:2048', // optional image upload
            'name'           => 'required|string|max:255',
            'category_id'    => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:categories,id',
            'branch_id'      => 'required|exists:branches,id',
            'price'          => 'nullable|numeric',
            'status'         => 'required|in:reserved,available,laundry,broken,in_session',
        ]);

        // Si se envía una imagen, guardarla en storage/app/public/clothes
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('clothes', 'public');
            $validated['image'] = $path;
        }

        $cloth = Cloth::create($validated);
        return response()->json($cloth, 201);
    }

    /**
     * Show a single cloth.
     */
    public function show($id)
    {
        $cloth = Cloth::with(['category', 'subcategory', 'branch'])->findOrFail($id);
        return response()->json($cloth);
    }

    /**
     * Update a cloth.
     */
    public function update(Request $request, $id)
    {
        $cloth = Cloth::findOrFail($id);
        $validated = $request->validate([
            'image'          => 'nullable|image|max:2048',
            'name'           => 'sometimes|required|string|max:255',
            'category_id'    => 'sometimes|required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:categories,id',
            'branch_id'      => 'sometimes|required|exists:branches,id',
            'price'          => 'nullable|numeric',
            'status'         => 'sometimes|required|in:reserved,available,laundry,broken,in_session',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('clothes', 'public');
            $validated['image'] = $path;
        }

        $cloth->update($validated);
        return response()->json($cloth);
    }

    /**
     * Delete a cloth.
     */
    public function destroy($id)
    {
        $cloth = Cloth::findOrFail($id);
        $cloth->delete();
        return response()->json(null, 204);
    }
}
