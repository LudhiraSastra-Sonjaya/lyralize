<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    public function index()
    {
        return response()->json(Album::all());
    }

    public function store(Request $request)
    {
        $data = $request->except('cover_image');
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('albums', 'public');
            $data['cover_image_url'] = url('storage/' . $path);
        }

        $album = Album::create($data);
        return response()->json($album, 201);
    }

    public function show(Album $album)
    {
        return response()->json($album);
    }

    public function update(Request $request, Album $album)
    {
        $data = $request->except('cover_image');
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('albums', 'public');
            $data['cover_image_url'] = url('storage/' . $path);
        }

        $album->update($data);
        return response()->json($album);
    }

    public function destroy(Album $album)
    {
        $album->delete();
        return response()->json(null, 204);
    }
}
