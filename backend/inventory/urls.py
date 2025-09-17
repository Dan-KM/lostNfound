from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryView, 
    SubCategoryView, 
    ItemView, 
    UserItemView,
    # ItemCreationViews,
    CategoryWithSubCategoryView,
    # sse_notifications,
    ItemReportView
)

categoryRouter = DefaultRouter()
categoryRouter.register('categories',CategoryView)

subCategoryRouter = DefaultRouter()
subCategoryRouter.register('subcategories',SubCategoryView)

itemRouter = DefaultRouter()
itemRouter.register('items', ItemView)

CategoryWithSubCategoryRouter = DefaultRouter()
CategoryWithSubCategoryRouter.register('item-categories', CategoryWithSubCategoryView)

userItemRouter = DefaultRouter()
userItemRouter.register('user-item', UserItemView)

urlpatterns=[
    path('', include(categoryRouter.urls)),
    path('', include(subCategoryRouter.urls)),
    path('', include(itemRouter.urls)),
    path('', include(CategoryWithSubCategoryRouter.urls)),
    path('', include(userItemRouter.urls)),
    # path('create-item/', ItemCreationViews.as_view(), name='create-item'),

    # path("events/", sse_notifications),
        path('item-report/', ItemReportView.as_view(), name='item-report'),

]