<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charity extends Model
{
    protected $table = 'charities';     // or 'Charity' if your DB uses that
    protected $primaryKey = 'charity_ID';

    public $timestamps = false;        // set true if you have created_at/updated_at

    protected $fillable = [
        'charity_name',
        'charity_description',
        // add more fields if your table has them
    ];
}
