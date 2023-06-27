

from django.contrib import admin
from django.urls import path, re_path
from ProductsBase.views import *
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from django.views.generic import RedirectView

def CentralCore(request, *args, **kwargs):
    print(request.user)
    return render(request, 'index.html')

urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('GetProducts/', ProductCentre.as_view()),
    path('GetUsersCardProducts/', UsersCartProducts.as_view()),
    path('AdjustCartProducts/<int:actionType>/<int:product_ID>/', UsersCartProducts.as_view()),
    path('', CentralCore),
    path('Main/', CentralCore),
    path('Main/<str:data>/', CentralCore),
    path('login/', CentralCore),
    path('GetProducts/<str:SpecialType>/', GetProducts.as_view()),
    path('GetFilteredData/<str:KeyWord>/', GetFilteredData.as_view()),
    path('GetUsersCardProducts/', UsersCartProducts.as_view()),
    path('SignUp/', Authentication.as_view()),
    path('SignIn/', LoginHandler.as_view()),
    path('AdminChatBox/', CentralCore),
    path('AdminChatBox/<str:Id_Parameter>/', CentralCore),
    path('getSupportClients/', GetSupportClients),
    path('GetClientMessages/<int:ClientID>', GetClientMessages),
    path('Get_UserInfo/', GetClient_Profile_info),
    path('Payment/', CentralCore),
    path('GetIcon/<str:code_name>/', IconsManager),
    path('GetIcon/<str:code_name>/<str:ForMainPage>/', IconsManager),
    path('Home/', CentralCore, name='home'),
    path('Contact/', CentralCore),
    path('Authentication_Check/', Check_User_Authenticity),
    re_path(r'^.*/$', RedirectView.as_view(pattern_name='home'), name='catch-all'),
] 

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)