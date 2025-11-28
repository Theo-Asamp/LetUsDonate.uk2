<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charity extends Model
{
    protected $table = 'Charity';
    protected $primaryKey = 'charity_ID';
    public $timestamps = false;

    // Add fillable if you need mass-assignment later:
    // protected $fillable = ['charity_name', 'address', ...];
}
