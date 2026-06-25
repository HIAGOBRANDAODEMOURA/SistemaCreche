from django.contrib import admin
from .models import Turma, Aluno, RegistroRotina

# Isso já cria interfaces completas de busca e filtro para a diretora!
@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'professor')

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'turma', 'responsavel')
    list_filter = ('turma',)
    search_fields = ('nome',)

@admin.register(RegistroRotina)
class RegistroRotinaAdmin(admin.ModelAdmin):
    list_display = ('aluno', 'data', 'pedagoga')
    list_filter = ('data', 'aluno__turma')