from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    CATEGORY_CHOICES = [
        ('CONSTRUCCION', 'Construcción'),
        ('LIMPIEZA', 'Limpieza'),
        ('JARDINERIA', 'Jardinería'),
        ('REPARACIONES', 'Reparaciones'),
        ('TRANSPORTE', 'Transporte'),
        ('OTROS', 'Otros'),
    ]

    title = models.CharField(max_length=200, verbose_name='Título del trabajo')
    description = models.TextField(verbose_name='Descripción')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Categoría')
    location = models.CharField(max_length=200, verbose_name='Ubicación')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Creado por')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última actualización')
    is_active = models.BooleanField(default=True, verbose_name='Activo')

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
