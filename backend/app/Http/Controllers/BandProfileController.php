<?php

namespace App\Http\Controllers;

use App\Models\BandProfile;
use Illuminate\Http\Request;

class BandProfileController extends Controller
{
    public function index()
    {
        return response()->json(BandProfile::first() ?? new BandProfile());
    }

    public function update(Request $request)
    {
        $profile = BandProfile::first();
        
        $data = $request->except('hero_video_file');
        if ($request->hasFile('hero_video_file')) {
            $path = $request->file('hero_video_file')->store('profile', 'public');
            $data['hero_video_url'] = url('storage/' . $path);
        }

        if ($profile) {
            $profile->update($data);
        } else {
            $profile = BandProfile::create($data);
        }
        return response()->json($profile);
    }
}
