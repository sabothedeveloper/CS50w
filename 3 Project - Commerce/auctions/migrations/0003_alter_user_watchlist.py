# Generated by Django 4.1 on 2022-08-30 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auctions", "0002_user_watchlist_delete_watchlist"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="watchlist",
            field=models.ManyToManyField(blank=True, to="auctions.listings"),
        ),
    ]