from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from .models import PeriUser
import re


class SignUpForm(UserCreationForm):
    group = forms.ChoiceField(
        choices=[
            ('', 'Select Group ...'),
            ('Administrator', 'Administrator'),
            ('Clinician', 'Clinician'),
        ],
        label='',
        widget=forms.Select(attrs={'id': 'group'})
    )

    role = forms.ChoiceField(
        label='',
        widget=forms.Select(attrs={'id': 'role'}),
        choices=[
            ('', 'Select Role ...'),
            ('Admin', 'Admin'),
            ('Health Records Officer', 'Health Records Officer'),
            ('Medical Officer', 'Medical Officer'),
            ('Clinical Officer', 'Clinical Officer'),
            ('Nursing Officer', 'Nursing Officer'),
            ('Radiologist', 'Radiologist'),
            ('Lab Technician', 'Lab Technician'),
            ('Pharmacist', 'Pharmacist'),
        ]
    )

    first_name = forms.CharField(
        label="",
        max_length=50,
        widget=forms.TextInput(
            attrs={'placeholder': 'First Name', 'title': 'First Name'})
    )
    last_name = forms.CharField(
        label="",
        max_length=50,
        widget=forms.TextInput(
            attrs={'placeholder': 'Surname', 'title': 'Surname'})
    )
    email = forms.EmailField(
        label="",
        widget=forms.EmailInput(
            attrs={'placeholder': 'Email Address', 'title': 'Email Address'})
    )
    username = forms.CharField(
        label="",
        max_length=50,
        widget=forms.TextInput(
            attrs={'placeholder': 'Username', 'title': 'Username'})
    )
    password1 = forms.CharField(
        label="",
        max_length=50,
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Password', 'title': 'Password'})
    )
    password2 = forms.CharField(
        label="",
        max_length=50,
        widget=forms.PasswordInput(
            attrs={'placeholder': 'Confirm Password', 'title': 'Password Confirmation'})
    )

    class Meta:
        model = PeriUser
        fields = ('group', 'role', 'username', 'first_name',
                  'last_name', 'email', 'password1', 'password2')

    def clean(self):
        cleaned_data = super().clean()

        username = cleaned_data.get('username')
        password1 = cleaned_data.get('password1')

        if username and len(username) < 5:
            self.add_error('username', 'A minimum of 5 characters is required')

        if password1:
            if len(password1) < 15:
                self.add_error(
                    'password1', 'A minimum of 15 characters is required')

            is_upper = bool(re.search(r'[A-Z]', password1))
            is_lower = bool(re.search(r'[a-z]', password1))

            if not (is_lower and is_upper):
                self.add_error(
                    'password1', 'Include both upper and lower case characters')

        return cleaned_data
