# -*- coding: utf-8 -*-
from django.shortcuts import render

from utils.libs.logger import SysLogger


def login_view(request):
    """
    管理端登录
    :param request:
    :return:
    """
    SysLogger.exception("121")
    return render(request, "privilege/login.html")
