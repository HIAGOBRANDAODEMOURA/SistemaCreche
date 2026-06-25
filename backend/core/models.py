from django.db import models
from django.contrib.auth.models import User

class Turma(models.Model):
    nome = models.CharField(max_length=100, help_text="Ex: Berçário, Maternal I")
    # O professor é um usuário do sistema.
    professor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='turmas_professor')

    def __str__(self):
        return self.nome

class Aluno(models.Model):
    nome = models.CharField(max_length=150)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
    # O pai/mãe também será um usuário do sistema (para acessar o app depois).
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='filhos')

    def __str__(self):
        return f"{self.nome} ({self.turma.nome})"

class RegistroRotina(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='rotinas')
    data = models.DateField(auto_now_add=True)
    
    # Atividades
    acolhida = models.CharField(max_length=50)
    estimulacao = models.JSONField(default=list) # Salva os múltiplos checkboxes
    
    # Alimentação
    lanche_manha = models.CharField(max_length=50)
    almoco = models.CharField(max_length=50)
    lanche_tarde = models.CharField(max_length=50)
    
    # Saúde e Higiene
    soneca = models.CharField(max_length=50)
    febre = models.CharField(max_length=50)
    temperatura = models.CharField(max_length=20, blank=True, null=True)
    hidratacao = models.CharField(max_length=50, blank=True, null=True)
    higiene = models.JSONField(default=list)
    pedagoga = models.CharField(max_length=100)

    class Meta:
        # Impede que a professora crie duas rotinas para o mesmo aluno no mesmo dia
        unique_together = ['aluno', 'data']

    def __str__(self):
        return f"Rotina de {self.aluno.nome} - {self.data.strftime('%d/%m/%Y')}"