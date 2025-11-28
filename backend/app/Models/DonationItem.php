<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationItem extends Model
{
    protected $table = 'Donation_item';
    protected $primaryKey = 'donation_item_ID';
    public $timestamps = false;

    protected $fillable = [
        'donation_ID',
        'item_name',
        'item_category',
        'item_size',
        'item_condition',
        'item_description',
        'item_image',
    ];
}
