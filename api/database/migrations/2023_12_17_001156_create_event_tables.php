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
        Schema::create('team_templates', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string('title', 255)->unique();
            $table->string('type', 100); // Enum strings
            $table->string('note', 255);
            $table->integer('maxMember', false, true);
            $table->timestamps();
        });
        Schema::create('events', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string('title', 255);
            $table->date('date');
        });
        Schema::create('teams', function (Blueprint $table) {
            $table->uuid()->primary();

            $table->foreignUuid('template_uuid')
                ->references('uuid')
                ->on('team_templates')
                ->onUpdate('cascade')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->foreignUuid('event_uuid')
                ->references('uuid')
                ->on('events')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
        Schema::create('teams_users', function (Blueprint $table) {
            $table->foreignUuid('team_uuid')
                ->references("uuid")
                ->on("teams")
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->references("id")
                ->on("users")
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_templates');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('events');
        Schema::dropIfExists('teams_users');
    }
};
