from statistics import mode
from unicodedata import category
from django.contrib.auth.models import AbstractUser
from django.db import models


# migration history is missing some of the first migrations. This is because at some point I
# changed some data in db.sqlite3 myself using sqlite queries in the terminal, which caused
# auctions to break. I didn't bother figuring out how to fix all of this, so I just copied the 
# directory and migrated fresh.

class listings(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=512, blank=True)
    bid = models.DecimalField(max_digits=100, decimal_places=2)
    image = models.URLField()
    category = models.CharField(max_length=32, blank=True)
    date = models.DateTimeField(auto_now=True)
    seller = models.CharField(max_length=64)
    winner = models.CharField(max_length=64, blank=True)
    is_active = models.BooleanField(default=True)
    current_price = models.DecimalField(max_digits=100, decimal_places=2, blank=True)


class User(AbstractUser):
    watchlist = models.ManyToManyField(listings, blank=True, related_name="watchlist")
    pass


class bids(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(listings, on_delete=models.CASCADE)
    bid = models.DecimalField(max_digits=100, decimal_places=2, blank=True)


class comments(models.Model):
    user = models.CharField(max_length=32)
    listing = models.ForeignKey(listings, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
    comment = models.TextField(blank=True)
