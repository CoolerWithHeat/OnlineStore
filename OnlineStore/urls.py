"""

    OnlineStore URL Configuration

    The `urlpatterns` list routes URLs to views. For more information please see:
        https://docs.djangoproject.com/en/4.1/topics/http/urls/
    Examples:
    Function views
        1. Add an import:  from my_app import views
        2. Add a URL to urlpatterns:  path('', views.home, name='home')
    Class-based views
        1. Add an import:  from other_app.views import Home
        2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
    Including another URLconf
        1. Import the include() function: from django.urls import include, path
        2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""

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