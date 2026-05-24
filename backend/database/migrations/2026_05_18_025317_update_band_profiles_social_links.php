<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('band_profiles', function (Blueprint $table) {
            $table->dropColumn('twitter_url');
            $table->string('apple_music_url')->nullable();
            $table->string('tiktok_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('band_profiles', function (Blueprint $table) {
            $table->string('twitter_url')->nullable();
            $table->dropColumn(['apple_music_url', 'tiktok_url']);
        });
    }
};
