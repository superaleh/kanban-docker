from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import CardSerializer, ColumnSerializer
from .models import Card, Column


class ColumnList(generics.ListCreateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Column.objects.all()

    def get(self, request):
        columns = self.serializer_class(
            self.get_queryset(), many=True, context={'user': request.user})
        return Response(columns.data)


class CardList(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Card.objects.all()

    def get_column(self, pk):
        column = get_object_or_404(Column, pk=pk)
        return column

    def get_queryset(self, *args, **kwargs):
        column_id = self.request.GET.get('column', None)
        if column_id is not None:
            column = self.get_column(column_id)
        return Card.objects.filter(column=column).order_by('order')

    def get(self, request, *args, **kwargs):
        column_id = self.request.GET.get('column', None)
        if column_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if 'column' in request.data.keys():
            self.get_column(request.data['column'])
            return super().post(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        column = self.get_column(self.request.data['column'])
        serializer.save(column=column, created_by=self.request.user)


class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        card = get_object_or_404(Card, pk=pk, created_by=self.request.user)
        return card
