from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from college_portal.views import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/v1/', include(('college_portal.urls', 'college_portal'), namespace='api')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
