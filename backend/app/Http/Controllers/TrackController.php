<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index()
    {
        return response()->json(Track::with('album')->orderBy('track_number')->get());
    }

    public function store(Request $request)
    {
        $track = Track::create($request->all());
        return response()->json($track->load('album'), 201);
    }

    public function show(Track $track)
    {
        return response()->json($track->load('album'));
    }

    public function update(Request $request, Track $track)
    {
        $track->update($request->all());
        return response()->json($track->load('album'));
    }

    public function destroy(Track $track)
    {
        $track->delete();
        return response()->json(null, 204);
    }
}
