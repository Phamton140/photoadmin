<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * List all categories (including subcategories).
     */
    public function index()
    {
        // Get all categories with their children (subcategories)
        $categories = Category::with('children')->whereNull('parent_id')->get();
        return response()->json($categories);
    }

    /**
     * List all categories (flat list, useful for dropdowns).
     */
    public function all()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Store a new category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    /**
     * Show a single category with its subcategories.
     */
    public function show($id)
    {
        $category = Category::with('children')->findOrFail($id);
        return response()->json($category);
    }

    /**
     * Update a category.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name'      => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        $category->update($validated);
        return response()->json($category);
    }

    /**
     * Delete a category.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }

    /**
     * Get subcategories of a specific category.
     */
    public function subcategories($id)
    {
        $category = Category::findOrFail($id);
        $subcategories = $category->children;
        return response()->json($subcategories);
    }
}
