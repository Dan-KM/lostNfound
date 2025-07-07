from .models import CustomUser
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    user_role = serializers.CharField(read_only= True)
    class Meta:
        model = CustomUser
        fields  = ['id','first_name','last_name','email', 'user_role','phone_number','user_image', 'password']
        # fields  = "__all__"
