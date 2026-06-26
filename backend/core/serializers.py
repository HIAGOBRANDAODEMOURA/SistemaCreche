from rest_framework import serializers
from .models import Aluno, RegistroRotina

class RegistroRotinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroRotina
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    # Traz a lista de rotinas do aluno
    rotinas = RegistroRotinaSerializer(many=True, read_only=True)
    
    # Busca os nomes reais nas tabelas conectadas para facilitar a vida do frontend
    turma_nome = serializers.CharField(source='turma.nome', read_only=True, default='Sem turma')
    responsavel_nome = serializers.CharField(source='responsavel.nome_completo', read_only=True, default='Sem responsável')

    class Meta:
        model = Aluno
        fields = '__all__'