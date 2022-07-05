# Generated by Django 3.2.7 on 2021-10-02 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('OrderId', models.AutoField(primary_key=True, serialize=False)),
                ('OrderDate', models.TextField(blank=True)),
                ('LineItems', models.TextField(blank=True)),
                ('TotalAmount', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('PaymentId', models.AutoField(primary_key=True, serialize=False)),
                ('CustomerName', models.TextField(blank=True)),
                ('PaymentDate', models.TextField(blank=True)),
                ('PaymentMethod', models.TextField(blank=True)),
                ('Address', models.TextField(blank=True)),
                ('CardNumber', models.TextField(blank=True)),
                ('TotalAmount', models.TextField(blank=True)),
                ('OrderId', models.TextField(blank=True)),
            ],
        ),
    ]