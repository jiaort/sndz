# -*- coding: utf-8 -*-
from django.conf.urls import url
from . import views


urlpatterns = [
    url(r"login/?$", views.login_view, name="login"),
    url(r"test/?$", views.test_view, name="test"),
]
