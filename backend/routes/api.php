<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BandProfileController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MerchController;

// Public Routes
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/band-profile', [BandProfileController::class, 'index']);
Route::get('/albums', [AlbumController::class, 'index']);
Route::get('/albums/{album}', [AlbumController::class, 'show']);
Route::get('/shows', [ShowController::class, 'index']);
Route::get('/shows/{show}', [ShowController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/merch', [MerchController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/band-profile', [BandProfileController::class, 'update']);
    
    Route::apiResource('albums', AlbumController::class)->except(['index', 'show']);
    Route::apiResource('tracks', TrackController::class);
    Route::apiResource('shows', ShowController::class)->except(['index', 'show']);
    Route::apiResource('gallery', GalleryController::class)->except(['index']);
    Route::apiResource('merch', MerchController::class)->except(['index']);
    
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{message}', [MessageController::class, 'show']);
    Route::put('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
});
