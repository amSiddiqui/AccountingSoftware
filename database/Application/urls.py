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
    url(r'^util/country/$', views.country, name='country'),
    url(r'^util/quote/$', views.quote, name='quote'),
    url(r'^util/currency/$', views.currencies, name='currency'),
    url(r'^util/datefmt/$', views.dates, name='datefmt'),
    url(r'^util/phone_code/$', views.phones, name='phone_code'),
    url(r'^auth/signup/$', views.company, name='company'),
    url(r'^auth/exists/$', views.user_exists, name='user_exists'),
    url(r'^auth/company/exists/$', views.company_exists, name='company_exists'),
    url(r'^auth/accountant/exists/$', views.accountant_exists, name='accountant_exists'),

    # Invoice routes
    path('invoice/<int:invoice_id>/', views.fetch_invoice ),
    path('invoice/create/', views.create_invoice ),
    path('invoice/latest/', views.latest_invoice ),
    path('invoice/delete/', views.delete_invoice ),

    # Vendor routes
    path('vendor/create/', views.create_vendor ),
    path('vendor/', views.fetch_vendor),
    path('vendorID/', views.fetch_vendor_Id),

    # Category routes
    path('category/create/', views.category_create),
    path('category/', views.category_fetch),

    #Expense Routes
    path('expense/create/', views.expense_create),
    path('expense/latest/', views.expense_latest),
    path('expense/<int:expense_id>/', views.expense_fetch),
    path('expense/<int:expense_id>/update/', views.expense_update),
    path('expense/delete/', views.expense_delete),

    #Client Routes
    path('client/create/', views.client_create),
    path('client/latest/', views.client_latest),
    path('client/<int:client_id>/', views.client_fetch),
    path('client/<int:client_id>/update/', views.client_update),
    path('client/delete/', views.client_delete),


    # Report routes
    # path('client/', views.report_client ),
    path('report/outstandingRevenue/',views.report_outstandingRevenue),
    path('report/overdue/',views.report_overdue),
    path('report/profit/',views.report_profit),
    path('report/revenue/',views.report_revenue),
    path('report/expense/',views.report_expense),
    path('userToken/',views.check_token),
]
