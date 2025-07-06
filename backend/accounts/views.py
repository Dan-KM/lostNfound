from rest_framework import viewsets, generics

from .serializers import CustomUserSerializer
from .models import CustomUser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# Create your views here.

class CustomUserView(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    lookup_field = 'pk'

#     def get (self, request):

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data)


# class CustomUserCreateView(generics.GenericAPIView):
#     serializer_class = CustomUserSerializer
#     queryset = CustomUser.objects.all()
#     permission_classes = [AllowAny]

#     def post(self, request):
#         print('request', request)
#         data = request.data.copy()
#         password = data.get('password')
#         # password = data.get('password')

#         if not password:
#             return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

#         # Hash the password before validation
#         data['password'] = make_password(password)

#         serializer = CustomUserSerializer(data=data)

#         if serializer.is_valid():
#             # Save with hashed password and server-set fields
#             user = serializer.save()

#             return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserCreateView(generics.GenericAPIView):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]

    def post(self, request):
        print("\n=== Incoming Request ===")
        print("Headers:", request.headers)
        print("Content Type:", request.content_type)
        print("Raw Data:", request.body)  # This shows exactly what was received
        print("Parsed Data:", request.data)
        
        data = request.data.copy()
        print("Copied Data:", data)
        
        password = data.get('password')
        if not password:
            print("Error: No password provided")
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        data['password'] = make_password(password)
        print("Data after password hash:", data)
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")
            user = serializer.save()
            print("User created:", user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)