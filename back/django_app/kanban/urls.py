from django.urls import path
from .views import CardDetail, CardList, ColumnList

urlpatterns = [
    path('', ColumnList.as_view()),
    path('cards/', CardList.as_view()),
    path('cards/<int:pk>/', CardDetail.as_view()),
]
