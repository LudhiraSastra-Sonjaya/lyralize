<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::orderBy('order', 'asc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $data['image_url'] = url('storage/' . $path);
        } else if (!$request->has('image_url')) {
            $data['image_url'] = ''; // fallback
        }

        $gallery = Gallery::create($data);
        return response()->json($gallery, 201);
    }

    public function show(Gallery $gallery)
    {
        return response()->json($gallery);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $data['image_url'] = url('storage/' . $path);
        }

        $gallery->update($data);
        return response()->json($gallery);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return response()->json(null, 204);
    }
}
