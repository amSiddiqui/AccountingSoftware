from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from . import views

app_name='Application'

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^init/$', views.init, name='init'),
    # path('init/', views.init),
    url(r'^auth/login$', views.login_user, name='login_user'),
    url(r'^auth/logout$', views.logout, name='logout'),
    url(r'^util/country$', views.country, name='country'),
    url(r'^util/quote$', views.quote, name='quote'),
    url(r'^util/currency$', views.currencies, name='currency'),
    url(r'^util/datefmt$', views.dates, name='datefmt'),
    url(r'^util/phone_code$', views.phones, name='phone_code'),
    url(r'^auth/signup$', views.company, name='company')
]