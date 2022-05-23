#!/bin/sh
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."
    
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done
    
    echo "PostgreSQL started"
fi

python manage.py migrate --noinput
echo "
from django.contrib.auth.models import User
from kanban.models import Column
if not User.objects.filter(email='$DJANGO_ADMIN_EMAIL').exists():
  User.objects.create_superuser('$DJANGO_ADMIN_USER', '$DJANGO_ADMIN_EMAIL', '$DJANGO_ADMIN_PASSWORD')
columns = [{'title': 'ON-HOLD', 'color': 'fb7e46'}, {'title': 'IN-PROGRESS', 'color': '2a92bf'}, 
{'title': 'NEEDS-REVIEW', 'color': 'f4ce46'}, {'title': 'APPROVED', 'color': '00b961'}]
for col in columns:
  if not Column.objects.filter(**col).exists():
    Column.objects.create(**col)
" | python manage.py shell

exec "$@"