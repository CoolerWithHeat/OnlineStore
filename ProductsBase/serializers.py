from . import models
from rest_framework import serializers

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = '__all__'


class MessagesSerializer(serializers.ModelSerializer):
    SenderID = serializers.SerializerMethodField()
    sender   = serializers.SerializerMethodField()
    SenderImage = serializers.SerializerMethodField()
    StaffImage = serializers.SerializerMethodField()
    SenderIsStaff = serializers.SerializerMethodField()
    class Meta:
        model = models.messages
        fields = ['id', 'SenderID', 'message', 'sender', 'SenderImage', 'StaffImage', 'SenderIsStaff']
        
    
    def get_SenderID(self, dataStream):
        return dataStream.Sender.id
    
    def get_SenderIsStaff(self, Dataflow):
        return True if Dataflow.Sender.SupportStaff else False

    def get_StaffImage(self, DataFlow):
        icon = models.IconsForFrontend.objects.get(file_code='staff_icon')
        return icon.file.url if icon.file else models.IconsForFrontend.objects.get(file_code="default_user").file.url
        

    def get_SenderImage(self, dataStream):
        if dataStream.Sender.SupportStaff:
            icon = models.IconsForFrontend.objects.get(file_code='staff_icon')
            return icon.file.url if icon.file else models.IconsForFrontend.objects.get(file_code="staff_icon").file.url
        else:
            return dataStream.Sender.image.url if dataStream.Sender.image else models.IconsForFrontend.objects.get(file_code="default_user").file.url
    
    def get_sender(self, dataStream):
        Sender = dataStream.Sender
        last_name = Sender.last_name if not (Sender.last_name == 'Not Last Name') else ''
        first_name = Sender.first_name if not (Sender.first_name == 'No Name') else ''
        ProcessedSender = (last_name + first_name) if last_name else first_name 
        FinalizedSender = ProcessedSender if ProcessedSender else Sender.email
        return FinalizedSender


class CartProductsSerializer(serializers.ModelSerializer):
    TrashIcon = serializers.SerializerMethodField()
    BottomLine = serializers.SerializerMethodField()
    class Meta:
        model = models.Cart
        fields = ['ClonedProduct', 'TrashIcon', 'BottomLine']
        depth = 1
    
    def get_TrashIcon(self, dataFlow):
        icon = models.IconsForFrontend.objects.get(file_code='trash_icon').file
        return icon.url if icon else None
    
    def get_BottomLine(self, DataFlow):
        return DataFlow.BottomLine