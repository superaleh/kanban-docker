from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('rest/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('rest/dj-rest-auth/registration/',
         include('dj_rest_auth.registration.urls')),
    path('rest/kanban/', include('kanban.urls')),
]
