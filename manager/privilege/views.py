# -*- coding: utf-8 -*-
import urllib

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from utils.libs.logger import SysLogger


def about_view(request):
    return render(request, "privilege/about_view.html")


def login_view(request):
    """
    管理端登录
    :param request:
    :return:
    """
    back_url = request.parameters.get('back_url')
    if not back_url:
        back_url = reverse('about')
    user_info = request.session.get('user_info')
    if user_info:
        return HttpResponseRedirect(back_url)
    if request.method == "GET":
        return render(request, "privilege/login.html")
    else:
        user_name = request.POST.get('name')
        password = request.POST.get('password')
        user = authenticate(username=user_name, password=password)
        if not user or not user.is_active:
            messages.warning(request, u'登录失败，请检查用户名密码后重试.')
            return HttpResponseRedirect('%s?%s' % (reverse('login'), urllib.urlencode({'back_url': back_url})))
        login(request, user)

        # 登录成功之后，取出权限列表,放入session和cookie
        response = HttpResponseRedirect(back_url)
        return response


def test_view(request):
    """
    管理端登录
    :param request:
    :return:
    """
    SysLogger.exception("121")
    return render(request, "privilege/account.html")
