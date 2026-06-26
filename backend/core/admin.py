from django.contrib import admin
from .models import Professor, Responsavel, Turma, Aluno, RegistroRotina

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'cpf', 'telefone')
    search_fields = ('nome_completo', 'cpf')
    ordering = ('nome_completo',)

@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'cpf', 'telefone', 'grau_parentesco')
    search_fields = ('nome_completo', 'cpf')
    ordering = ('nome_completo',)

@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor')
    list_filter = ('professor',)

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turma', 'responsavel')
    list_filter = ('turma',)
    search_fields = ('nome',)

@admin.register(RegistroRotina)
class RegistroRotinaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data', 'pedagoga')
    list_filter = ('data', 'aluno__turma')