from django.contrib import admin
from .models import Job, Review

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'location', 'price', 'created_by', 'created_at', 'is_active')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'created_at'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('job', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('comment', 'job__title', 'user__username')
    date_hierarchy = 'created_at'
