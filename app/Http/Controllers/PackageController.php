<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    /**
     * List all packages.
     */
    public function index()
    {
        return response()->json(Package::with(['category', 'subcategory'])->get());
    }

    /**
     * Store a new package.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'category_id'    => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:categories,id',
            'description'    => 'nullable|string',
            'price'          => 'nullable|numeric',
            'duration'       => 'nullable|integer',
            'duration_unit'  => 'required|in:hours,days',
        ]);

        $package = Package::create($validated);
        return response()->json($package, 201);
    }

    /**
     * Show a single package.
     */
    public function show($id)
    {
        $package = Package::with(['category', 'subcategory'])->findOrFail($id);
        return response()->json($package);
    }

    /**
     * Update a package.
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);
        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'category_id'    => 'sometimes|required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:categories,id',
            'description'    => 'nullable|string',
            'price'          => 'nullable|numeric',
            'duration'       => 'nullable|integer',
            'duration_unit'  => 'sometimes|in:hours,days',
        ]);
        $package->update($validated);
        return response()->json($package);
    }

    /**
     * Delete a package.
     */
    public function destroy($id)
    {
        $package = Package::findOrFail($id);
        $package->delete();
        return response()->json(null, 204);
    }
}
