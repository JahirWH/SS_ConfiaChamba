from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import UserProfile, Job

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('phone_number', 'address', 'city', 'state', 'profile_picture', 'bio')
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
        }

class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'category', 'location', 'payment_type', 'price',
            'contact_phone', 'contact_email', 'requirements', 'experience_required', 'schedule'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'requirements': forms.Textarea(attrs={'rows': 3}),
            'schedule': forms.TextInput(attrs={'placeholder': 'Ej: Lunes a viernes, 9am-5pm'}),
        } 
        