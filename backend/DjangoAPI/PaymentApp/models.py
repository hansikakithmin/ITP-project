from django.db import models


class Order(models.Model):
    OrderId = models.AutoField(primary_key=True)
    OrderDate = models.TextField(blank=True)
    LineItems = models.TextField(blank=True)
    TotalAmount = models.TextField(blank=True)


class Payment(models.Model):
    PaymentId = models.AutoField(primary_key=True)
    CustomerName = models.TextField(blank=True)
    PaymentDate = models.TextField(blank=True)
    PaymentMethod = models.TextField(blank=True)
    Address = models.TextField(blank=True)
    CardNumber = models.TextField(blank=True)
    TotalAmount = models.TextField(blank=True)
    OrderId = models.TextField(blank=True)
