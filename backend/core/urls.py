from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, RegistroRotinaViewSet, LoginPersonalizado

router = DefaultRouter()
# Adicionamos o basename='aluno' aqui para o roteador não se perder
router.register(r'alunos', AlunoViewSet, basename='aluno')
router.register(r'rotinas', RegistroRotinaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginPersonalizado.as_view()),
]