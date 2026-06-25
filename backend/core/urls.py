from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, RegistroRotinaViewSet, LoginPersonalizado

router = DefaultRouter()
router.register(r'alunos', AlunoViewSet)
router.register(r'rotinas', RegistroRotinaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginPersonalizado.as_view()), # <--- Agora usa a nossa função inteligente
]