# -*- coding: utf-8 -*-


from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)

    class Meta:
        model = Product
        fields = ("id", "name")
