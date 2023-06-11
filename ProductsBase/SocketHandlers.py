from channels.consumer import AsyncConsumer, StopConsumer as BreakConnection
from asgiref.sync import sync_to_async, async_to_sync
from . import models
import json
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from channels.layers import get_channel_layer
from .views import GeneratePassword as GenerateLayerCode
from django.db.models.signals import post_save
from django.dispatch import receiver
from .EmailBase import send_email


channel_layer = get_channel_layer()

@sync_to_async
def url_parse_for_clients(url):
    client = url.split('CW')[0]
    staff = url.split('CW')[1].split('/')[0]
    return [client, staff]

@sync_to_async
def getIdDigits(id):

    if int(id) < 10:
        return ['#', str(id)]
    
    return [str(id)[0], str(id)[1]]

class ConsumerChatHandler(AsyncConsumer):



    async def websocket_connect(self, event):

        token = self.scope['path'].split('/chat/token=')[-1]
        Valid_Credentials = await GetConsumerChannelLayer(token)

        await self.send({
            "type": "websocket.accept",
        })

        if Valid_Credentials:
            self.CurrentUser = Valid_Credentials[-1]
            self.user = Valid_Credentials[-1]
            self.CloningIDs = await getIdDigits(self.user.id)
            self.layerCode = self.CloningIDs[0] + Valid_Credentials[1] + self.CloningIDs[1]
            self.RespondentStaff = Valid_Credentials[0]
            
            if self.user.admin or self.user.SupportStaff:
                await self.send({
                    "type": "websocket.send",
                    'text':json.dumps({'status':500, 'error':'only regular consumers access this chat!'})
                })

                print('error sent!')
                print('connection Stopped: Unauthorized Client!')
                raise BreakConnection

            
            else:

                await self.channel_layer.group_add(
                        self.layerCode,
                        self.channel_name
                )

                await self.channel_layer.group_send(self.layerCode, {
                    "type": "message.send",
                    'text': json.dumps({'TempID':self.user.id})
                })

        else:
            await self.send({
                "type": "websocket.send",
                'text':json.dumps({'status':500, 'error':'only regular consumers access this chat!'})
            })
            print('error sent!')
            print('connection Stopped: Unauthorized Client!')
            raise BreakConnection
        

    async def websocket_receive(self, event):
        data = json.loads(event['text'])
        sender_Token = data["token"]
        sender = await GetUserByToken(sender_Token)
        Staff  = self.RespondentStaff
        message = data['UsersText']
        response = await Save_Message(self.user, Staff, message, sender)

        await self.channel_layer.group_send(self.layerCode, {
            "type": "message.send",
            "text": json.dumps(response),
        })


    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(self.layerCode, self.channel_name)

        raise BreakConnection
    
    async def message_send(self, event):
        
        data = json.loads(event['text'])

        await self.send({
            'type':'websocket.send',
            'text':json.dumps(data)
        })

@sync_to_async
def GetStaffClients(Staff):
    
    Threads = models.Threads.objects.filter(Responder_Staff=Staff)
    user_IDs = []

    for each_client in Threads:
        user_IDs.append(each_client.User.id)
    return user_IDs

@sync_to_async
def GetConsumerChannelLayer(token, user_id=None):

    ClientUser = Token.objects.get(key=token).user if Token.objects.filter(key=token) else None
    Thread = models.Threads.objects.filter(User=ClientUser)
    Client_Alocated_staff = Thread[0].Responder_Staff if Thread else None

    if ClientUser and Client_Alocated_staff:
        return [Client_Alocated_staff, Client_Alocated_staff.ChannelLayer, ClientUser]

    else:
        return None

@sync_to_async
def GetAdminChannelLayer(token, user_id=None):

    Staff_user = Token.objects.get(key=token).user if Token.objects.filter(key=token) else False
    ClientUser = models.User.objects.get(id=int(user_id)) if user_id else None

    if Staff_user.SupportStaff:
        return [Staff_user, Staff_user.ChannelLayer, ClientUser]
    
    if Staff_user:
        
        thread_available = models.Threads.objects.get(User=models.User.objects.get(id=user_id))

        if thread_available:
            print(thread_available.User, thread_available.Responder_Staff)
            return [Staff_user, Staff_user.ChannelLayer, ClientUser]
        
        else: 
            responders = models.SupportStaff.objects.filter(responsible_Clients__lt=100)
            least_busy_staff = responders.last()
            Thread = models.Threads.objects.create(User=Staff_user, Responder_Staff=least_busy_staff, Layercode=least_busy_staff.ChannelLayer)
            return [Staff_user, Staff_user.ChannelLayer, ClientUser]
    else:
        return False
    

class AdminChatHandler(AsyncConsumer):

    async def websocket_connect(self, event):
        url = self.scope['url_route']['kwargs']['Client_ID']
        Requested_Client_ID = await url_parse_for_clients(url)
        token = self.scope['path'].split(f'/{url}/token=')[-1]
        Valid_Credentials = await GetAdminChannelLayer(token, Requested_Client_ID[0])

        await self.send({
            "type": "websocket.accept",
        })

        if Valid_Credentials:
            self.CurrentUser = Valid_Credentials[0]
            self.StaffUser = Valid_Credentials[0]
            self.ClientUser = Valid_Credentials[2]
            self.CloningIDs = await getIdDigits(self.ClientUser.id)
            self.layerCode = self.CloningIDs[0] + Valid_Credentials[1] + self.CloningIDs[1]

            if self.StaffUser.SupportStaff:
                responsible_user_IDs = await GetStaffClients(self.StaffUser)
                await self.channel_layer.group_add(
                    self.layerCode,
                    self.channel_name
                )

                await self.channel_layer.group_send(
                    self.layerCode,
                    {
                        "type": "message.send",
                        'text': json.dumps({'StaffTempID':self.StaffUser.id})
                    }
                )

            
            
        else:



            await self.send({

                "type": "websocket.send",
                'text': json.dumps({'status':500}),

            })

            print('connection Stopped: Unauthorized Client!')
            raise BreakConnection

    async def websocket_receive(self, event):

        data = json.loads(event['text'])
        sender_Token = data["SenderToken"]
        sender = await GetUserByToken(sender_Token)
        message = data["message"]
        Client = self.ClientUser
        Staff = self.StaffUser
        response = await Save_Message(Client, Staff, message, sender)

        await self.channel_layer.group_send(self.layerCode, {
            "type": "message.send",
            "text": json.dumps(response),
        })

    async def websocket_disconnect(self, event):

        await self.channel_layer.group_discard(self.layerCode, self.channel_name)
        raise BreakConnection
    
    async def message_send(self, event):
        
        data = json.loads(event['text'])

        await self.send({
            'type':'websocket.send',
            'text':json.dumps(data)
        })


@sync_to_async
def Save_Message(Client, Staff, Sent_message, Sender=False):
    #SenderIsStaff SenderImage StaffImage
    
    Thread = models.Threads.objects.get(Responder_Staff=Staff, User=Client)
    message = models.messages.objects.create(associated_thread=Thread, message=Sent_message, Sender=Sender)
    last_name = Sender.last_name if not (Sender.last_name == 'Not Last Name') else ''
    first_name = Sender.first_name if not (Sender.first_name == 'No Name') else ''
    ProcessedSender = (last_name + first_name) if last_name else first_name 
    FinalizedSender = ProcessedSender if ProcessedSender else message.Sender.email
    SenderImage = Sender.image.url if Sender.image else models.IconsForFrontend.objects.get(file_code='default_user').file.url
    StaffImage = models.IconsForFrontend.objects.get(file_code='staff_icon').file.url
    SenderIsStaff = True if Sender.SupportStaff else False
    if message: return {'id':message.id, 'message':Sent_message, 'sender':f'{FinalizedSender}', 'SenderID':message.Sender.id, 'SenderImage':SenderImage, 'StaffImage': StaffImage, 'SenderIsStaff':SenderIsStaff}

@sync_to_async
def GetUserByToken(token):
    return Token.objects.get(key=token).user

# @staticmethod
# @database_sync_to_async
def send_notification_to_member(self):
    channel_layer = self.layerCode
    channel_name = self.channel_name
    async_to_sync(self.channel_layer.group_send)(channel_layer, {

            'type': 'websocket.send',
            
            'text': {
                'text': 'Message SenT',
                # 'id': '!!!!!!!!'
            }
        
        })


StaffConnection = set()

class Admin_Clients_Notification(AsyncConsumer):

    async def websocket_connect(self, event):

        url = self.scope['url_route']['kwargs']
        token = self.scope['path'].split(f'/ClientsMonitor/token=')[-1]
        Valid_Credentials = await GetAdminChannelLayer(token)
        await self.send({
            "type": "websocket.accept",
        })

        if Valid_Credentials:
            self.Staff = Valid_Credentials[0]
            self.layerCode = self.Staff.ChannelLayer

            if self.Staff.SupportStaff:

                await self.channel_layer.group_add(
                    self.layerCode,
                    self.channel_name
                )

                await self.channel_layer.group_send(
                    self.layerCode,
                    {
                        "type": "message.send",
                        'text': json.dumps({'StaffTempID':self.Staff.id})
                    }
                )

                StaffConnection.add(self)
            
            
        else:



            await self.send({

                "type": "websocket.send",
                'text': json.dumps({'status':500}),

            })

            print('connection Stopped: Unauthorized Client!')
            raise BreakConnection

    async def websocket_receive(self, event):

        await self.channel_layer.group_send(self.layerCode, {
            "type": "message.send",
            "text": json.dumps({'message': 'Client Notified!'}),
        })

    async def websocket_disconnect(self, event):
        StaffConnection.remove(self)
        await self.channel_layer.group_discard(self.layerCode, self.channel_name)
        raise BreakConnection
    
    async def message_send(self, event):
        
        data = json.loads(event['text'])

        await self.send({
            'type':'websocket.send',
            'text':json.dumps(data)
        })


    @receiver(post_save, sender=models.messages)
    def handle_model_change(sender, instance, created, **kwargs):
        for self in StaffConnection:
            channel_layer = self.layerCode
            channel_name = self.channel_name
            user_id = self.Staff.id
            StaffEmail = self.Staff.email
            
            if (instance.associated_thread.Responder_Staff == self.Staff) and not (instance.Sender == self.Staff):
                async_to_sync(self.channel_layer.group_send)(channel_layer, {

                    'type': 'message.send',
                    'text': json.dumps({'Messaged_User_ID': instance.Sender.id})      

                    })