from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from PaymentApp.models import Order, Payment
from PaymentApp.serializers import OrderSerializers, PaymentSerializers


@csrf_exempt
def orderApi(request, id=0):
    if request.method == 'GET':
        orders = Order.objects.all()
        order_serializer = OrderSerializers(orders, many=True)
        return JsonResponse(order_serializer.data, safe=False)
    elif request.method == 'POST':
        order_data = JSONParser().parse(request)
        order_serializer = OrderSerializers(data=order_data)
        if order_serializer.is_valid():
            order_serializer.save()
            return JsonResponse(order_serializer.data, safe=False)
        return JsonResponse({"error": "error occured!"}, safe=False)
    elif request.method == 'PUT':
        order_data = JSONParser().parse(request)
        order = Order.objects.get(OrderId=order_data['OrderId'])
        order_serializer = OrderSerializers(order, data=order_data)
        if order_serializer.is_valid():
            order_serializer.save()
            return JsonResponse(order_serializer.data, safe=False)
        return JsonResponse({"error": "error occured!"})
    elif request.method == 'DELETE':
        order = Order.objects.get(OrderId=id)
        order.delete()
        return JsonResponse({"deleted": id}, safe=False)


@csrf_exempt
def paymentApi(request, id=0):
    if request.method == 'GET':
        payment = Payment.objects.all()
        payment_serializer = PaymentSerializers(payment, many=True)
        return JsonResponse(payment_serializer.data, safe=False)
    elif request.method == 'POST':
        payment_data = JSONParser().parse(request)
        payment_serializer = PaymentSerializers(data=payment_data)
        if payment_serializer.is_valid():
            payment_serializer.save()
            return JsonResponse(payment_serializer.data, safe=False)
        return JsonResponse({"error": "error occured!"}, safe=False)
    elif request.method == 'PUT':
        payment_data = JSONParser().parse(request)
        payment = Payment.objects.get(PaymentId=payment_data['PaymentId'])
        payment_serializer = PaymentSerializers(payment, data=payment_data)
        if payment_serializer.is_valid():
            payment_serializer.save()
            return JsonResponse(payment_serializer.data, safe=False)
        return JsonResponse({"error": "error occured!"})
    elif request.method == 'DELETE':
        payment = Payment.objects.get(PaymentId=id)
        payment.delete()
        return JsonResponse({"deleted": id}, safe=False)
