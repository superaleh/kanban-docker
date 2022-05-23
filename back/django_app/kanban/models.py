from django.db import models
from django.db.models import Max
from django.contrib.auth import get_user_model
User = get_user_model()


class Column(models.Model):
    title = models.CharField(max_length=255)
    ORANGE = 'fb7e46'
    BLUE = '2a92bf'
    YELLOW = 'f4ce46'
    GREEN = '00b961'
    COLORS_CHOICES = [
        (ORANGE, 'Orange'),
        (BLUE, 'Blue'),
        (YELLOW, 'Yellow'),
        (GREEN, 'Green'),
    ]
    color = models.CharField(
        max_length=6, choices=COLORS_CHOICES, default=ORANGE)


class Card(models.Model):
    column = models.ForeignKey(
        Column, on_delete=models.CASCADE, related_name='cards')
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=255)
    order = models.DecimalField(
        max_digits=30, decimal_places=15, blank=True, null=True)

    def save(self, *args, **kwargs):
        filtered_objects = Card.objects.filter(column=self.column)
        if not self.order and filtered_objects.count() == 0:
            self.order = 2 ** 16 - 1
        elif not self.order:
            self.order = filtered_objects.aggregate(Max('order'))[
                'order__max'] + 2 ** 16 - 1
        return super().save(*args, **kwargs)
