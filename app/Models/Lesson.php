<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['module_id', 'title', 'duration', 'type', 'content_url'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}