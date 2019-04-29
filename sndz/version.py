# -*- coding: utf-8 -*-
"""
    ----------------------------------------------------------------------------
    | 注意： 本文件为build脚本自动生成，除了VERSION字段，请勿修改其他任何内容！|
    ----------------------------------------------------------------------------

    version命名规则： 大版本号.小版本号.build号
    大版本号：重大版本变更，多发生在重构号修改  -- 手动修改
    小版本号：增加新功能或新模块 -- 手动修改
    build号：每次打包时自动改为当前时间戳或git仓库HEAD短串 -- 自动变更
"""

import subprocess
import time
import re

VERSION = '1.0'
BUILD = '0'


def gen_build_no(type=0):
    """获得build版本号

    type: 0 -- git 仓库HEAD短串
          1 -- 10位unix时间戳
    """
    if type == 0:
        try:
            build = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).strip()
        except Exception:
            build = 'nohash'
    else:
        build = str(int(time.time()))
    return build


def update_version_file(filepath):
    """更新version.py文件
    """
    content = ''
    with open(filepath, 'r') as f:
        data = f.read()
        build_no = gen_build_no(1)
        content = re.sub(r"BUILD = '\w*'", "BUILD = '%s'" % build_no, data)
    with open(filepath, 'w') as f:
        f.write(content)


def get_version():
    """获得最终version

    version值为VERSION.BUILD"""
    # reload version模块，确保刚替换完version文件后获得的BUILD号是最新的
    return VERSION + '.' + BUILD
