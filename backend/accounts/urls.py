from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

# from .views import CustomUserView, CustomUserCreateView, me_view
from .views import CustomUserCreateView, me_view
from rest_framework.routers import DefaultRouter

# userRouter =  DefaultRouter()
# userRouter.register('me', CustomUserView)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('register/', CustomUserCreateView.as_view(), name='register'),
    # path('', include(userRouter.urls), name='user-data')
    path('me/', me_view),
]