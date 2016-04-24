
from django.contrib import admin

from .models import *


class farm_name(admin.ModelAdmin):
    readonly_fields = ['name','user','state','crop_name']
    list_filter = ('user',)

    def name(self, obj):
        if obj.user:
            return obj.user
        else:
            return 'N/A'


class result(admin.ModelAdmin):
    readonly_fields = ['name','farm','date_of_reading','temperature','humidity','moisture']
    list_filter = ('farm',)

    def name(self, obj):
        if obj.date_of_reading:
            return obj.date_of_reading
        else:
            return 'N/A'

class y(admin.ModelAdmin):
    readonly_fields = ['farm','yield_of_ginger']
    list_filter = ('farm',)

admin.site.register(Farm_new,farm_name)
admin.site.register(Crop_new,result)
admin.site.register(yield_tracking,y)