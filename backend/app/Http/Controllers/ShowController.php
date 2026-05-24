<?php

namespace App\Http\Controllers;

use App\Models\Show;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function index()
    {
        return response()->json(Show::orderBy('show_date', 'asc')->get());
    }

    public function store(Request $request)
    {
        $show = Show::create($request->all());
        return response()->json($show, 201);
    }

    public function show(Show $show)
    {
        return response()->json($show);
    }

    public function update(Request $request, Show $show)
    {
        $show->update($request->all());
        return response()->json($show);
    }

    public function destroy(Show $show)
    {
        $show->delete();
        return response()->json(null, 204);
    }
}
