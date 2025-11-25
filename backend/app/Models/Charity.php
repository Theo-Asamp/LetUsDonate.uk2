<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charity extends Model
{
    protected $table = 'charities'; // table name
    protected $primaryKey = 'charity_ID';

    protected $fillable = [
        'charity_name',
        'charity_description',
        // add more fields if needed
    ];
}
