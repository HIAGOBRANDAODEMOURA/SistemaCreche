from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Aluno, RegistroRotina
from .serializers import AlunoSerializer, RegistroRotinaSerializer

class LoginPersonalizado(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        # Identificação automática do perfil logado
        if hasattr(user, 'perfil_professor'):
            perfil = 'professor'
            nome = user.perfil_professor.nome_completo
        elif hasattr(user, 'perfil_responsavel'):
            perfil = 'pai'
            nome = user.perfil_responsavel.nome_completo
        else:
            perfil = 'admin'
            nome = user.first_name or user.username

        return Response({
            'token': token.key,
            'perfil': perfil,
            'nome': nome
        })

class AlunoViewSet(viewsets.ModelViewSet):
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Se for um responsável logado, filtra apenas os próprios filhos
        if hasattr(user, 'perfil_responsavel'):
            return Aluno.objects.filter(responsavel=user.perfil_responsavel)
        return Aluno.objects.all()

class RegistroRotinaViewSet(viewsets.ModelViewSet):
    queryset = RegistroRotina.objects.all()
    serializer_class = RegistroRotinaSerializer
    permission_classes = [IsAuthenticated]