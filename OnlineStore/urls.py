from django.contrib import admin
from django.urls import path, re_path
from ProductsBase.views import *
from django.shortcuts import render
from django.views.generic import RedirectView
from django.core.files.storage import default_storage
from ProductsBase.models import IconsForFrontend
from django.http import JsonResponse



urlpatterns = [

    path('admin/', admin.site.urls),
    path('GetProducts/', ProductCentre.as_view()),
    path('GetUsersCardProducts/', UsersCartProducts.as_view()),
    path('AdjustCartProducts/<int:actionType>/<int:product_ID>/', UsersCartProducts.as_view()),
    path('', RedirectView.as_view(pattern_name='home'), name='catch-all'),
    path('GetProducts/<str:SpecialType>/', GetProducts.as_view()),
    path('GetFilteredData/<str:KeyWord>/', GetFilteredData.as_view()),
    path('GetUsersCardProducts/', UsersCartProducts.as_view()),
    path('SignUp/', Authentication.as_view()),
    path('SignIn/', LoginHandler.as_view()),
    path('getSupportClients/', GetSupportClients),
    path('GetClientMessages/<int:ClientID>', GetClientMessages),
    path('Get_UserInfo/', GetClient_Profile_info),
    path('GetIcon/<str:code_name>/', IconsManager),
    path('GetIcon/<str:code_name>/<str:ForMainPage>/', IconsManager),
    path('Authentication_Check/', Check_User_Authenticity),

    # path('Main/', CentralCore),
    # path('Main/<str:data>/', CentralCore),
    # path('login/', CentralCore),
    # path('AdminChatBox/', CentralCore),
    # path('AdminChatBox/<str:Id_Parameter>/', CentralCore),
    # path('Payment/', CentralCore),
    # path('Home/', CentralCore, name='home'),
    # path('Contact/', CentralCore),
    # re_path(r'^.*/$', RedirectView.as_view(pattern_name='home'), name='catch-all'),

]