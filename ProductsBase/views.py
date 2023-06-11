from django.shortcuts import render
from . import serializers
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from . import models
import json
import requests
import random, string

def download_image(url, filename, save_to='/TemporaryStorage/'):
    response = requests.get(url)
    print(url, filename)
    with open(save_to + filename, 'wb') as f:
        f.write(response.content)

def GeneratePassword(length):

    def generateRawPassword(firstBatch, SecondBatch):
        data = ''.join(random.choices(string.ascii_lowercase + string.digits, k=firstBatch)) + ''.join(random.choices(string.ascii_uppercase + string.digits, k=SecondBatch))
        return data
    
    firstBatch = round(length/2)
    secondBatch = length-firstBatch
    return generateRawPassword(firstBatch, secondBatch)

class ProductCentre(APIView):

    serializer = serializers.ProductsSerializer

    def get(self, instance):
        serialized_data = self.serializer(models.Product.objects.all(), many=True)
        return Response({'products': serialized_data.data})
    


class UsersCartProducts(APIView):

    serializer = serializers.CartProductsSerializer

    def get(self, request):
        requesting_user = request.user
        print(requesting_user)
        query = models.Cart.objects.get(CardOwner=requesting_user)
        serialized_data = self.serializer(query)
        return Response({'result': serialized_data.data})
    
    def post(self, request, actionType, product_ID):

        requesting_user = request.user
        cart = models.Cart.objects.get(CardOwner=requesting_user)

        if not actionType:

            cart.ClonedProduct.remove(models.Product.objects.get(id=product_ID))
            query = models.Cart.objects.get(CardOwner=requesting_user)
            serialized_data = self.serializer(query)
            return Response({"products": serialized_data.data}, status=200)
        
        else:

            cart.ClonedProduct.add(models.Product.objects.get(id=product_ID))
            query = models.Cart.objects.get(CardOwner=requesting_user)
            serialized_data = self.serializer(query)
            ProcessedData = serialized_data.data
            return Response({"products": ProcessedData}, status=200)



class GetProducts(APIView):

    serializer = serializers.ProductsSerializer

    def get(self, request, SpecialType):
        queryset = models.Product.objects.all() if SpecialType.lower() == "all" else models.Product.objects.all()[1:SpecialType]
        processed = self.serializer(queryset, many=True)
        return Response({'products': processed.data})
    

class GetFilteredData(APIView):

    serializer = serializers.ProductsSerializer

    def get(self, request, KeyWord):
        queryset = models.Product.objects.filter(title__icontains=KeyWord)
        processed = self.serializer(queryset, many=True)
        return Response({'result': processed.data})
    

class GoogleResponseParser:
    def __init__(self, data_file):
        self.data_file = data_file


    @property
    def get_FirstName(self):
        raw_data = self.data_file['google']['user']['displayName']
        processed = raw_data.split(' ')
        return processed[0]

    @property
    def get_LastName(self):
        raw_data = self.data_file['google']['user']['displayName']
        processed = raw_data.split(' ')
        return processed[1]

    @property
    def get_EmailAdress(self):
        return self.data_file['google']['user']['email']
    

    @property
    def get_PHOTO_url(self):
        return self.data_file['google']['user']['photoURL']
    
    @property
    def get_PhoneNumber(self):
        return self.data_file['google']['user']['providerData'][0]['phoneNumber']
    
class FacebookResponseParser:
    def __init__(self, data_file):
        self.data_file = data_file


    @property
    def get_FirstName(self):
        raw_data = self.data_file['facebook']['user']['displayName']
        processed = raw_data.split(' ')
        return processed[0]

    @property
    def get_LastName(self):
        raw_data = self.data_file['facebook']['user']['displayName']
        processed = raw_data.split(' ')
        return processed[1]

    @property
    def get_EmailAdress(self):
        return self.data_file['facebook']['user']['email']
    

    @property
    def get_PHOTO_url(self):
        return self.data_file['facebook']['user']['photoURL']
    
    @property
    def get_PhoneNumber(self):
        return self.data_file['facebook']['user']['providerData'][0]['phoneNumber']


class Authentication(APIView):

    def post(self, request, *args, **kwargs):

        data = json.loads(request.body)

        parserClasses = {

            'Google': GoogleResponseParser,
            'Facebook': FacebookResponseParser,
        
        }
        
        Auth_type = 'Facebook' if data.get('facebook', None) else 'Google' if data.get('google', None) else 'Custom-Authentication'
        
        if Auth_type == 'Custom-Authentication':

            CredentialsBase = data['custom']
            email = CredentialsBase['email']
            passCode1 = CredentialsBase['password1']
            passCode2 = CredentialsBase['password2']

            try:
                
                user = get_user_model().objects.create(email=email, password=passCode1, Authenticated_By=Auth_type)
                token = Token.objects.get_or_create(user=user)
            
                return Response({'success': True, 'token': str(token)}, status=200)
            
            except:
                return Response({'success': False, 'error': 'user with these credentials already exists'}, status=500)
        else:

            SpecifiedCredentials = parserClasses[Auth_type](data)

            try:
                
                user = get_user_model().objects.get(email=SpecifiedCredentials.get_EmailAdress)
                token = Token.objects.create(user=user) if Token.objects.get(user=user).delete() else None
                print(token.user)
                if user:
                    return Response({'success': True, 'token': str(token)}, status=200)
                    
            except:
                from django.core.files.base import ContentFile
                user = get_user_model().objects.create(email=SpecifiedCredentials.get_EmailAdress, password=GeneratePassword(8), first_name=SpecifiedCredentials.get_FirstName, last_name=SpecifiedCredentials.get_LastName, Authenticated_By=Auth_type)
                token = Token.objects.create(user=user)
                if Auth_type == 'Google':
                    imageRequest = requests.get(SpecifiedCredentials.get_PHOTO_url)
                    image_file = ContentFile(imageRequest.content)
                    image_name = SpecifiedCredentials.get_EmailAdress.split('@gmail.com')[0]
                    user.image.save(f'{image_name}.jpg', image_file)
                    user.save()
                else:
                    image_name = SpecifiedCredentials.get_EmailAdress.split('@gmail.com')[0]
                    user.image.save(f'{image_name}.jpg', models.IconsForFrontend.objects.get(file_code='default_user').file)
                    user.save()

                return Response({'success': True, 'token': str(token)}, status=200)
                


class LoginHandler(APIView):

    def post(self, request, *args, **kwargs):

        data = json.loads(request.body)
        CredentialsBase = data['credentials']
        email = CredentialsBase['email']
        password = CredentialsBase['password']
        try:

            user = get_user_model().objects.get(email=email)
            if user.Authenticated_By == "Custom-Authentication":
                token = Token.objects.create(user=user) if Token.objects.get(user=user).delete() else None
                login(request, user)

                return Response({'Logged In': True, 'token':str(token)}, status=200)
            
            else:
                return Response({'Logged In': False, 'error':'this account can only choose google or facebook auth'}, status=500)
        
        except:
            return Response({'Logged In': False, 'error':'User with these credentials not found!'}, status=500)


@api_view(['GET'])
def GetSupportClients(request):
    user = request.user
    if user.SupportStaff:
        clientIDs = []
        clients = models.Threads.objects.filter(Responder_Staff=user)
        for AdminClients in clients:
            user_id = AdminClients.User.id
            clientIDs.append(user_id)
        return Response({"clients": clientIDs, 'StaffId':user.id})
    else:
        return Response({"clients": 'staff access only!'}, status=500)


@api_view(['GET'])
def IconsManager(request, code_name=None, ForMainPage=None):
    user = request.user
    
    if ForMainPage:
        hp = models.IconsForFrontend.objects.get(file_code='hp_image').file.url
        dell = models.IconsForFrontend.objects.get(file_code='xps_image').file.url
        alienware = models.IconsForFrontend.objects.get(file_code='alienware_image').file.url
        return Response({'MainPageImages':[dell, hp, alienware]})
    else:   
        try: 
            icon = models.IconsForFrontend.objects.get(file_code=code_name)
            return Response({'file':icon.file.url if icon.file else None})
        except:
            return Response({'file':'File Not Found!'})


@api_view(['GET'])
def GetClientMessages(request, ClientID):
    user = request.user
    if user.SupportStaff:
        Thread = models.Threads.objects.get(User=get_user_model().objects.get(id=ClientID), Responder_Staff=user) if models.Threads.objects.filter(User=get_user_model().objects.get(id=ClientID), Responder_Staff=user) else None
        messages = models.messages.objects.filter(associated_thread=Thread) if Thread else None
        serialized_data = serializers.MessagesSerializer(messages, many=True)   
        return Response({"response": serialized_data.data})
    else:
        Thread = models.Threads.objects.get(User=user)
        messages = models.messages.objects.filter(associated_thread=Thread) if Thread else None
        serialized_data = serializers.MessagesSerializer(messages, many=True)
        return Response({"response": serialized_data.data}, status=200)
    

@api_view(['GET'])
def GetClient_Profile_info(request):
    user = request.user
    print(user)
    if str(user) == 'AnonymousUser':
        return Response({'errors':'Invalid User'}, status=500)
    else:
        if user.SupportStaff or user.admin:
            return Response({'errors':'Staff Needs other Regular Account To access This Page'}, status=500)
        else:
            user_credentials = {'image_url': user.image.url if user.image else models.IconsForFrontend.objects.get(file_code='default_user').file.url,'email':user.email, 'first_name': user.first_name if not (user.first_name == 'No Name') else None, 'last_name': user.last_name if not (user.last_name == 'Not Last Name') else None}
            return Response({"response": user_credentials})
        

@api_view(['GET'])
def GetClient_Profile_info(request):
    user = request.user
    print(user)
    if str(user) == 'AnonymousUser':
        return Response({'errors':'Invalid User'}, status=500)
    else:
        if user.SupportStaff or user.admin:
            return Response({'errors':'Staff Needs other Regular Account To access This Page'}, status=500)
        else:
            user_credentials = {'image_url': user.image.url if user.image else models.IconsForFrontend.objects.get(file_code='default_user').file.url,'email':user.email, 'first_name': user.first_name if not (user.first_name == 'No Name') else None, 'last_name': user.last_name if not (user.last_name == 'Not Last Name') else None}
            return Response({"response": user_credentials})

@api_view(['GET'])   
def Check_User_Authenticity(request):
    user = request.user

    if user.is_authenticated:
        return Response({'error': False}, status=200)
    
    else:
        return Response({'error': 'Unauthenticated user'}, status=500)