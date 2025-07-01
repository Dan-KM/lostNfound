from rest_framework import viewsets

from .serializers import CustomUserSerializer
from .models import CustomUser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

# Create your views here.

class CustomUserView(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'pk'


class CustomUserCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        password = data.get('password')

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the password before validation
        data['password'] = make_password(password)

        serializer = CustomUserSerializer(data=data)

        if serializer.is_valid():
            # Save with hashed password and server-set fields
            user = serializer.save()

            return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

