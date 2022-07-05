from django.conf.urls import url
from PaymentApp import views

urlpatterns = [
    url(r'^order$', views.orderApi),
    url(r'^order/([0-9]+)$', views.orderApi),
    url(r'^payment$', views.paymentApi),
    url(r'^payment/([0-9]+)$', views.paymentApi)
]
