# Generated by Django 5.2.3 on 2025-07-02 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0002_job_contact_email_job_contact_phone_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='payment_type',
            field=models.CharField(choices=[('COMPLETO', 'Pago por trabajo completo'), ('HORA', 'Pago por hora')], default='COMPLETO', max_length=10, verbose_name='Tipo de pago'),
        ),
        migrations.AlterField(
            model_name='job',
            name='category',
            field=models.CharField(choices=[('CONSTRUCCION', 'Construcción'), ('LIMPIEZA', 'Limpieza'), ('JARDINERIA', 'Jardinería'), ('REPARACIONES', 'Reparaciones'), ('TRANSPORTE', 'Transporte'), ('PLOMERIA', 'Plomería'), ('ELECTRICIDAD', 'Electricidad'), ('CARPINTERIA', 'Carpintería'), ('ALBANILERIA', 'Albañilería'), ('PINTURA', 'Pintura'), ('CUIDADO_PERSONAS', 'Cuidado de personas'), ('CUIDADO_ANIMALES', 'Cuidado de animales'), ('COCINA', 'Cocina'), ('TAPICERIA', 'Tapicería'), ('HERRERIA', 'Herrería'), ('LAVANDERIA', 'Lavandería'), ('MUDANZA', 'Mudanza'), ('JARDINERIA', 'Jardinería'), ('MECANICA', 'Mecánica'), ('MANUALIDADES', 'Manualidades'), ('VENTAS', 'Ventas ambulantes'), ('OTROS', 'Otros')], max_length=20, verbose_name='Categoría'),
        ),
        migrations.AlterField(
            model_name='job',
            name='description',
            field=models.TextField(verbose_name='Descripción del trabajo a hacer'),
        ),
        migrations.AlterField(
            model_name='job',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Monto de pago'),
        ),
    ]
