from typing import Any
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.db.models.signals import pre_save, post_save, post_delete, pre_delete
from django.dispatch import receiver
from django.db.models.query import QuerySet
from django.contrib.auth.hashers import make_password 
# needed database tabels for product model are CPU_details price title image CPU_details GPU_details RAM_details Panel_details

Authentication_Types = [

    ("Custom-Authentication", "Custom-Authentication"),
    ("Google", "Google"),
    ("Facebook", "Facebook"),
    
]



class UserManager(BaseUserManager):

    def get_queryset(self):
        return super().get_queryset()
    
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )
        
        user.set_password(make_password(password))
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser):

    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    first_name = models.CharField(max_length=30, default='No Name', null=False, blank=False)
    last_name = models.CharField(max_length=30, default='Not Last Name', null=True, blank=True)
    image = models.FileField(default=None, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False) # a admin user; non super-user
    admin = models.BooleanField(default=False) # a superuser
    SupportStaff = models.BooleanField(default=False)
    responsible_Clients = models.IntegerField(default=0)
    ChannelLayer = models.CharField(max_length=20, default='Need Attention here!', blank=True, null=True)
    Authenticated_By = models.CharField(default=Authentication_Types[2], choices=Authentication_Types, max_length=21)
    objects = UserManager()
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Email & Password are required by default.

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.staff

    @property
    def is_admin(self):
        "Is the user a admin member?"
        return self.admin


class Product(models.Model):
    
    title = models.CharField(max_length=35, default='No title', null=True, blank=False)
    price = models.DecimalField(max_digits=7, decimal_places=3)
    image = models.FileField(default=None, null=True, blank=True)
    CPU_details = models.CharField(max_length=22, default='Not Specified Yet', null=False, blank=True)
    GPU_details = models.CharField(max_length=22, default='Not Specified Yet', null=False, blank=True)
    RAM_details = models.CharField(max_length=24, default='Not Specified Yet', null=False, blank=True)
    Panel_details = models.CharField(max_length=25, default='Not Specified Yet', null=False, blank=True)
    discount = models.FloatField(default=None, null=True, blank=True)
    
    @property
    def get_discount(self):
        return ( self.price / 100 ) * self.discount
    
    def __str__(self):
        return self.title

class StaffManager(models.Manager):
    def create(self, **kwargs: Any):
        print('-------------------------------------')
        return super().create(**kwargs)
    def get_queryset(self):
        return super().get_queryset().filter(SupportStaff=True)

class SupportStaff(User):
    objects = StaffManager()

    class Meta:
        proxy = True
        verbose_name_plural = "Support Staff"



class Cart(models.Model):

    CardOwner = models.OneToOneField(User, on_delete=models.CASCADE)
    ClonedProduct = models.ManyToManyField(Product, default=None, blank=True)

    def __str__(self):
        return f'Products of {self.CardOwner.get_username()}'
    
    @property
    def BottomLine(self):
        total = 0.00
        for each in self.ClonedProduct.all():
            total += float(each.price)
        return round(total, 2)
    
class IconsForFrontend(models.Model):
    file_code = models.CharField(max_length=35, blank=False, null=False)
    file = models.FileField(default=None, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Icons for Front-End"
    
    def __str__(self):
        return self.file_code.split('_')[0] + ' ' + self.file_code.split('_')[1]


@receiver(pre_save, sender=SupportStaff)
def SaveLayer(sender, instance, **kwargs):
    from .views import GeneratePassword as GenerateLayerCode
    instance.ChannelLayer = GenerateLayerCode(20)

@receiver(post_save, sender=User)
def AlocateStaff(sender, instance, **kwargs):
    
    if not instance.SupportStaff:
        try:
            Threads.objects.get(User=instance)
            return 0
        except:

            Support_Member = SupportStaff.objects.filter(responsible_Clients__lt=100).order_by('responsible_Clients').first()
            Threads.objects.create(User=instance, Responder_Staff=Support_Member, Layercode=Support_Member.ChannelLayer)



class Threads(models.Model):
    Layercode = models.CharField(max_length=20, blank=False, null=False)
    User = models.ForeignKey(User, on_delete=models.CASCADE, related_name='Consumer')
    Responder_Staff = models.ForeignKey(SupportStaff, on_delete=models.CASCADE, related_name='Support_Member')
    class Meta:
        verbose_name_plural = "User Threads"
    
    def __str__(self):
        return f'Staff: {self.Responder_Staff.first_name} || Client: {self.User.email}'

@receiver(post_save, sender=Threads)
def IncreaseResponsibility(sender, instance, **kwargs):
    Staff = instance.Responder_Staff
    Staff.responsible_Clients += 1
    Staff.save()

@receiver(pre_delete, sender=Threads)
def DecreaseResponsibility(sender, instance, **kwargs):
    Staff = instance.Responder_Staff
    Staff.responsible_Clients -= 1
    Staff.save()


@receiver(post_save, sender=User)
def CreateCart(sender, instance, **kwargs):
    if not instance.SupportStaff:
        Cart.objects.get_or_create(CardOwner=instance)



class messages(models.Model):
    associated_thread = models.ForeignKey(Threads, on_delete=models.CASCADE, default=None)
    message = models.CharField(max_length=255, blank=False, null=False)
    Sender = models.ForeignKey(User, on_delete=models.CASCADE)
    class Meta:
        verbose_name_plural = "Messages"

    def __str__(self):
        return str(self.associated_thread)