from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from . import views

app_name='Application'

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^init/$', views.init, name='init'),
    url(r'^auth/login/$', views.login_user, name='login_user'),
    url(r'^auth/logout/$', views.logout, name='logout'),
    url(r'^auth/exists/$', views.user_exists, name='user_exists'),
    url(r'^auth/accountant/exists/$', views.accountant_exists, name='accountant_exists'),
    path('invoice/<int:invoice_id>/', views.fetch_invoice ),
    path('invoice/create/', views.create_invoice ),
    path('invoice/latest/', views.latest_invoice ),
    path('invoice/delete/', views.delete_invoice ),
    path('vendor/create/', views.create_vendor ),
    path('vendor/', views.fetch_vendor)

]