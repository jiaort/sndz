# -*- coding: utf-8 -*-
"""
Django settings for sndz project.

Generated by 'django-admin startproject' using Django 1.11.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '(ybq66nh97x*c7-=$_4$u_arnjx$-9hif#%t7bn!*_zqo3361)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bootstrap_pagination',
    'apps.privilege',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'utils.dlibs.middleware.request_init.RequestInitMiddleware'
]

ROOT_URLCONF = 'sndz.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['template'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sndz.wsgi.application'


# Mysql Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases
MYSQLDB_CONNECT_TIMEOUT = 1
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 3600,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'sndz',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '172.18.0.1',
        'PORT': '3306',
        'TEST': {
            'CHARSET': 'utf8',
            'COLLATION': 'utf8_general_ci'
        },
        'OPTIONS': {
            'connect_timeout': MYSQLDB_CONNECT_TIMEOUT,
        }
    }
}

# Redis
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://172.18.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PASSWORD': '',
            'CONNECTION_POOL_KWARGS': {
                'max_connections': 100
            },
        }
    },
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'zh-Hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), ]

# celery config
from config.celery_conf import *

# logger of libs
from utils.libs.config.logger_settings import *
# 重新更新所有handlers的filename，因为LOGGING是个DICT，在logger_conf内已经创建成功，需要再次更新
LOG_ROOT = BASE_DIR
for key, handler in LOGGING['handlers'].items():
    if handler.get('filename', None):
        # 将logs文件夹定义为项目根目录的上一层，这由docker部署目录结构决定
        handler['filename'] = os.path.join(LOG_ROOT, '../logs', os.path.basename(handler['filename']))

# version
from version import VERSION as VER, BUILD
VERSION = '%s.%s' % (VER, BUILD)

# import local settings
try:
    from .local_settings import *
    print "\033[1;32;40m%s\033[0m" % "local_settings imported."
except ImportError:
    pass
