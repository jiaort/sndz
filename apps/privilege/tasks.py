# -*- coding: utf-8 -*-

from celery import shared_task


@shared_task
def test_celery():
    print 'test celery'
