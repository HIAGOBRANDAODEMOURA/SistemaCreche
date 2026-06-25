from rest_framework import viewsets
from .models import Aluno, RegistroRotina
from .serializers import AlunoSerializer, RegistroRotinaSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    # Por enquanto liberado sem autenticação para testarmos o fluxo do React
    permission_classes = [] 

class RegistroRotinaViewSet(viewsets.ModelViewSet):
    queryset = RegistroRotina.objects.all()
    serializer_class = RegistroRotinaSerializer
    permission_classes = []

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class LoginPersonalizado(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Valida o usuário e a senha
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Pega ou cria o token de acesso
        token, created = Token.objects.get_or_create(user=user)

        # Descobre qual é o papel desse usuário no sistema
        perfil = 'admin' # Padrão para você que criou o superuser
        
        if hasattr(user, 'turmas_professor') and user.turmas_professor.exists():
            perfil = 'professor'
        elif hasattr(user, 'filhos') and user.filhos.exists():
            perfil = 'pai'

        # Devolve o token junto com as informações úteis
        return Response({
            'token': token.key,
            'perfil': perfil,
            'nome': user.first_name or user.username
        })