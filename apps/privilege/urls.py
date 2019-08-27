# -*- coding: utf-8 -*-
from django.conf.urls import url
import views


urlpatterns = [
    url(r'^product/$', views.ProductView.as_view(), name='product')
]
