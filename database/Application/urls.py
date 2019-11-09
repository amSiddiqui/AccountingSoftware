from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from . import views

app_name='Application'

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^init/$', views.init, name='init'),
    url(r'^auth/login$', views.login_user, name='login_user'),
    url(r'^auth/logout$', views.logout, name='logout'),
]