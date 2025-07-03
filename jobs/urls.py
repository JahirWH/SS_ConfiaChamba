from django.urls import path
from . import views


urlpatterns = [
    path('', views.job_list, name='job_list'),
    path('crear/', views.job_create, name='job_create'),
    path('registro/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('perfil/', views.profile_view, name='profile_view'),
    path('perfil/editar/', views.profile_edit, name='profile_edit'),
    path('trabajo/<int:job_id>/', views.info_job, name='info_job'),
] 

