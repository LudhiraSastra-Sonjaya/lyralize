<?php

namespace App\Http\Controllers;

use App\Models\Merch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MerchController extends Controller
{
    public function index()
    {
        return response()->json(Merch::all());
    }

    public function store(Request $request)
    {
        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('merch', 'public');
            $data['image_url'] = url('storage/' . $path);
        }
        
        $merch = Merch::create($data);
        return response()->json($merch, 201);
    }

    public function show(Merch $merch)
    {
        return response()->json($merch);
    }

    public function update(Request $request, Merch $merch)
    {
        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('merch', 'public');
            $data['image_url'] = url('storage/' . $path);
        }

        $merch->update($data);
        return response()->json($merch);
    }

    public function destroy(Merch $merch)
    {
        $merch->delete();
        return response()->json(null, 204);
    }
}
