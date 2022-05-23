from rest_framework import serializers

from .models import Card, Column


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'title', 'order', 'column']


class ColumnSerializer(serializers.ModelSerializer):
    cards = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Column
        fields = ['id', 'title', 'color', 'cards']

    def get_cards(self, obj):
        queryset = Card.objects.filter(
            column=obj, created_by=self.context['user']).order_by('order')
        return CardSerializer(queryset, many=True).data
