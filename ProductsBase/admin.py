from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Group
from django import forms
from . import models
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserCreationForm(forms.ModelForm):

    password = forms.CharField(label='Password', widget=forms.PasswordInput)


    class Meta:
        model = models.User
        fields = ['admin']

    def clean_password(self):
        password1 = self.cleaned_data.get("password")
        return password1

    def save(self, commit=True):

        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user

class UserChangeForm(forms.ModelForm):

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = models.User
        fields = ('email', 'password', 'is_active', 'admin')

    def clean_password(self):
        return self.initial["password"]

class UserAdmin(BaseUserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'admin')
    list_filter = ('admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'image', 'last_login', 'Authenticated_By')}),
        ('Permissions', {'fields': ('admin', 'staff', 'SupportStaff')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()    

admin.site.register(models.User, UserAdmin)   
admin.site.register(models.Cart)   
admin.site.register(models.IconsForFrontend) 
admin.site.register(models.SupportStaff) 
admin.site.register(models.Threads) 
admin.site.register(models.messages) 
admin.site.register(models.Product) 