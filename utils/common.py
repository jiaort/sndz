# -*- coding: utf-8 -*-

import random


def form_error(form_info):
    error_str = []
    for k, v in form_info.errors.items():
        if k == "__all__":
            error_str.append(v[0])
        else:
            error_str.append(u"%s:%s" % (form_info.fields[k].label, v[0]))

    return error_str


def gen_random_code(digits):
    return "".join([random.choice("abcdefghijklmnopqrstuvwxyz1234567890") for i in range(digits)])
