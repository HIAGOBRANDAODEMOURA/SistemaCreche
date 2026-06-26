from django.db import models
from django.contrib.auth.models import User

class Professor(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_professor')
    nome_completo = models.CharField(max_length=150)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20)
    
    def __str__(self):
        return self.nome_completo

class Responsavel(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_responsavel')
    nome_completo = models.CharField(max_length=150)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20)
    endereco = models.TextField()
    grau_parentesco = models.CharField(max_length=50)

    def __str__(self):
        return self.nome_completo

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, related_name='turmas')

    def __str__(self):
        return self.nome

class Aluno(models.Model):
    nome = models.CharField(max_length=150)
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='alunos')
    responsavel = models.ForeignKey(Responsavel, on_delete=models.SET_NULL, null=True, blank=True, related_name='filhos')

    def __str__(self):
        return self.nome

class RegistroRotina(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='rotinas')
    data = models.DateField(auto_now_add=True)
    acolhida = models.TextField(blank=True, null=True)
    estimulacao = models.JSONField(default=list, blank=True)
    lanche_manha = models.CharField(max_length=50, blank=True, null=True)
    almoco = models.CharField(max_length=50, blank=True, null=True)
    lanche_tarde = models.CharField(max_length=50, blank=True, null=True)
    soneca = models.CharField(max_length=100, blank=True, null=True)
    febre = models.CharField(max_length=3, choices=[('Sim', 'Sim'), ('Não', 'Não')], default='Não')
    temperatura = models.CharField(max_length=10, blank=True, null=True)
    higiene = models.JSONField(default=list, blank=True)
    pedagoga = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return f"Rotina de {self.aluno.nome} - {self.data}"