from django.db import models
from django.contrib.auth.models import User
from datetime import *

#this has a one - one relatonship with User table so that there is only one farm per user
class Farm_new(models.Model):
    States = (
        ('KA','karnataka'),
        ('TN','TamilNadu'),
        ('KL','kerela'),
        ('MH','Maharashtra'),
        ('DL','Delhi'),
    )
    Crop_list = (
        ('Gin','Ginger'),
    )
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    state = models.CharField(max_length=2, choices=States)
    crop_name = models.CharField(max_length=3,choices=Crop_list)

    def __str__(self):              # __unicode__ on Python 2
        return self.name


class Crop_new(models.Model):
    farm = models.ForeignKey(Farm_new,on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    date_of_reading = models.DateField(default=datetime.now, blank=True)
    temperature = models.CharField(max_length=10,null=True,blank=True)
    humidity = models.CharField(max_length=10,null=True,blank=True)
    moisture = models.CharField(max_length=10,null=True,blank=True)

    def __str__(self):              # __unicode__ on Python 2
        return str(self.date_of_reading)


class yield_tracking(models.Model):
    farm = models.ForeignKey(Farm_new,on_delete=models.CASCADE)
    yield_of_ginger = models.CharField(max_length=10,null=True,blank=True)

    def __str__(self):              # __unicode__ on Python 2
        return str(self.yield_of_ginger)
