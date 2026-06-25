from rest_framework import serializers
from .models import Turma, Aluno, RegistroRotina
from django.utils import timezone

class AlunoSerializer(serializers.ModelSerializer):
    turma_nome = serializers.CharField(source='turma.nome', read_only=True)
    # Criamos um campo novo calculado dinamicamente
    status = serializers.SerializerMethodField()

    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'turma', 'turma_nome', 'status']

    # Essa função verifica se já existe uma rotina HOJE para esse aluno
    def get_status(self, obj):
        hoje = timezone.now().date()
        ja_preencheu = RegistroRotina.objects.filter(aluno=obj, data=hoje).exists()
        return 'preenchido' if ja_preencheu else 'pendente'

class RegistroRotinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroRotina
        fields = '__all__'