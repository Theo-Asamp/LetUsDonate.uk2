<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $table = 'Donation'; // YOUR ACTUAL TABLE NAME
    protected $primaryKey = 'donation_ID';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'item_name',
        'category',
        'type',
        'quantity',
        'condition',
        'description',
        'pickup_address',
        'charity_name',
        'item_image',
        'donation_status',
        'donation_date',
    ];
}
