from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, verbose_name='Número de teléfono')
    address = models.CharField(max_length=200, verbose_name='Dirección')
    city = models.CharField(max_length=100, verbose_name='Ciudad')
    state = models.CharField(max_length=100, verbose_name='Estado')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True, verbose_name='Foto de perfil')
    bio = models.TextField(max_length=500, blank=True, verbose_name='Biografía')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0, verbose_name='Calificación')
    jobs_completed = models.IntegerField(default=0, verbose_name='Trabajos completados')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuario'

    def __str__(self):
        return f'Perfil de {self.user.username}'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Job(models.Model):
    CATEGORY_CHOICES = [
        ('CONSTRUCCION', 'Construcción'),
        ('LIMPIEZA', 'Limpieza'),
        ('JARDINERIA', 'Jardinería'),
        ('REPARACIONES', 'Reparaciones'),
        ('TRANSPORTE', 'Transporte'),
        ('PLOMERIA', 'Plomería'),
        ('ELECTRICIDAD', 'Electricidad'),
        ('CARPINTERIA', 'Carpintería'),
        ('ALBANILERIA', 'Albañilería'),
        ('PINTURA', 'Pintura'),
        ('CUIDADO_PERSONAS', 'Cuidado de personas'),
        ('CUIDADO_ANIMALES', 'Cuidado de animales'),
        ('COCINA', 'Cocina'),
        ('TAPICERIA', 'Tapicería'),
        ('HERRERIA', 'Herrería'),
        ('LAVANDERIA', 'Lavandería'),
        ('MUDANZA', 'Mudanza'),
        ('JARDINERIA', 'Jardinería'),
        ('MECANICA', 'Mecánica'),
        ('MANUALIDADES', 'Manualidades'),
        ('VENTAS', 'Ventas ambulantes'),
        ('OTROS', 'Otros'),
    ]

    title = models.CharField(max_length=200, verbose_name='Título del trabajo')
    description = models.TextField(verbose_name='Descripción del trabajo a hacer')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Categoría')
    location = models.CharField(max_length=200, verbose_name='Ubicación')
    PAYMENT_TYPE_CHOICES = [
        ('COMPLETO', 'Pago por trabajo completo'),
        ('HORA', 'Pago por hora'),
    ]
    payment_type = models.CharField(
        max_length=10,
        choices=PAYMENT_TYPE_CHOICES,
        default='COMPLETO',
        verbose_name='Tipo de pago'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Monto de pago'
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Creado por')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    contact_phone = models.CharField(max_length=15, verbose_name='Teléfono de contacto', blank=True)
    contact_email = models.EmailField(verbose_name='Correo de contacto', blank=True)
    requirements = models.TextField(verbose_name='Requisitos', blank=True)
    experience_required = models.CharField(max_length=100, verbose_name='Experiencia requerida', blank=True)
    schedule = models.CharField(max_length=200, verbose_name='Horario', blank=True)

    class Meta:
        verbose_name = 'Trabajo'
        verbose_name_plural = 'Trabajos'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Review(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='reviews', verbose_name='Trabajo')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Usuario')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name='Calificación')
    comment = models.TextField(verbose_name='Comentario')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')

    class Meta:
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'
        ordering = ['-created_at']

    def __str__(self):
        return f'Reseña de {self.user.username} para {self.job.title}'
