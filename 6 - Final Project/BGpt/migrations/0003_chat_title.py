# Generated by Django 4.2.1 on 2023-07-04 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BGpt', '0002_chat'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='title',
            field=models.CharField(default='title_placeholder', max_length=100),
            preserve_default=False,
        ),
    ]