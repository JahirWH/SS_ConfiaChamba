from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .models import Job, UserProfile
from .forms import UserRegistrationForm, UserProfileForm, JobForm

# Create your views here.

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, '¡Registro exitoso! Por favor completa tu perfil.')
            return redirect('profile_edit')
    else:
        form = UserRegistrationForm()
    return render(request, 'jobs/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'¡Bienvenido {username}!')
                return redirect('job_list')
    else:
        form = AuthenticationForm()
    return render(request, 'jobs/login.html', {'form': form})

@login_required
def profile_edit(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Perfil actualizado exitosamente.')
            return redirect('profile_view')
    else:
        form = UserProfileForm(instance=request.user.profile)
    return render(request, 'jobs/profile_edit.html', {'form': form})

@login_required
def profile_view(request):
    return render(request, 'jobs/profile_view.html', {'profile': request.user.profile})

def job_list(request):
    jobs = Job.objects.filter(is_active=True).order_by('-created_at')
    return render(request, 'jobs/job_list.html', {'jobs': jobs})


@login_required
def job_create(request):
    if request.method == 'POST':
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.created_by = request.user
            job.save()
            messages.success(request, '¡Trabajo publicado exitosamente!')
            return redirect('job_list')
    else:
        form = JobForm()
    return render(request, 'jobs/job_form.html', {'form': form})

def info_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id, is_active=True)
        return render(request, 'jobs/job_detail.html', {'job': job})
    except Job.DoesNotExist:
        messages.error(request, 'El trabajo no existe o no está disponible.')
        return redirect('job_list')

def login_count(request):
    return render(request, 'jobs/login.html')

def config(request):
    return render(request, 'jobs/conf.html')


