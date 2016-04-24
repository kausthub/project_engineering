from django.conf.urls import patterns, include, url
from login.views import *

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'soildata_web.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^register/$', register),
    url(r'^login/$', 'django.contrib.auth.views.login'),
    url(r'^logout/$', logout_page),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'), # If user is not login it will redirect to login page
    url(r'^register/success/$', register_success),
    url(r'^home/$', dashboard),
    url(r'^data/$',data),
    url(r'^analytics/$',analytic),
    url(r'^temperature/$',temperature),
    url(r'^humidity/$',humidity),
    url(r'^moisture/$',moisture),
    url(r'^sms/$',sms),
    url(r'^$',test),
)
