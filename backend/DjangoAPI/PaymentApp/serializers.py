from rest_framework import serializers
from PaymentApp.models import Payment, Order


class OrderSerializers(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('OrderId', 'OrderDate', 'LineItems', 'TotalAmount')


class PaymentSerializers(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('PaymentId', 'CustomerName', 'PaymentDate', 'PaymentMethod',
                  'Address', 'CardNumber', 'TotalAmount', 'OrderId')
