from login.forms import *
from .models import Farm_new , Crop_new , yield_tracking
import json
import subprocess
import os
from django.core.management import call_command
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.template import RequestContext


def sms(request):
    os.chdir(os.path.abspath('/home/soildata/soildata_web/login'))
    output1 = subprocess.call(["python","myscript.py"])
    return HttpResponse(output1)

@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user1 = User.objects.create_user(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1'],
            email=form.cleaned_data['email']
            )
            farmq = Farm_new(user=user1,name=form.cleaned_data['farm_name'],state=form.cleaned_data['farm_state'],crop_name=form.cleaned_data['farm_crop'])
            farmq.save()
            y = yield_tracking(farm=farmq,yield_of_ginger='0')
            y.save()
            return HttpResponseRedirect('/register/success/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {'form': form})

    return render_to_response(
    'registration/register.html',
    variables,
    )

def register_success(request):
    return render_to_response(
    'registration/success.html',
    )

def test(request):
    return render_to_response(
    'view1/view1.html',
    )

@login_required
def dashboard(request):

    usr = User.objects.get(username=request.user)
    f = Farm_new.objects.get(user=usr)
    temp =[]
    i=0
    for e in Crop_new.objects.values_list('temperature').filter(farm=f):
        g = list(e)
        g.insert(0,i)
        # lower and upper limit for the environment values
        g.append(23)
        g.append(28)
        temp.append(g)
        i=i+1

    T2 = [[int(column) for column in row] for row in temp]
    y ="Temperature"


    return render_to_response('view2/view2.html',{'data':T2,'user': request.user,'param':y})

@login_required
def temperature(request):
    usr = User.objects.get(username=request.user)
    f = Farm_new.objects.get(user=usr)
    temp =[]
    i=0
    for e in Crop_new.objects.values_list('temperature').filter(farm=f):
        g = list(e)
        g.insert(0,i)
        # lower and upper limit for the environment values
        g.append(23)
        g.append(28)
        temp.append(g)
        i=i+1

    T2 = [[int(column) for column in row] for row in temp]

    p = "Temperature"

    return render_to_response('view2/view2.html',{'data':T2,'user': request.user,'param':p})

@login_required
def humidity(request):
    usr = User.objects.get(username=request.user)
    f = Farm_new.objects.get(user=usr)
    temp =[]
    i=0
    for e in Crop_new.objects.values_list('humidity').filter(farm=f):
        g = list(e)
        g.insert(0,i)
        # lower and upper limit for the environment values
        g.append(65)
        g.append(85)
        temp.append(g)
        i=i+1

    T2 = [[int(column) for column in row] for row in temp]

    p = 'Humidity'
    return render_to_response('view2/view2.html',{'data':T2,'user': request.user,'param': p})

@login_required
def moisture(request):
    usr = User.objects.get(username=request.user)
    f = Farm_new.objects.get(user=usr)
    temp =[]
    i=0
    for e in Crop_new.objects.values_list('moisture').filter(farm=f):
        g = list(e)
        g.insert(0,i)
        # lower and upper limit for the environment values
        g.append(50)
        g.append(65)
        temp.append(g)
        i=i+1

    T2 = [[int(column) for column in row] for row in temp]
    p = "Moisture"
    return render_to_response('view2/view2.html',{'data':T2,'user': request.user,'param': p})

@login_required
def analytic(request):
    basic="/static/image/"
    usr = User.objects.get(username=request.user)
    f = Farm_new.objects.get(user=usr)
    lm = Crop_new.objects.values_list('moisture','temperature','humidity').filter(farm=f).order_by('-id')[0]
    m = int(lm[0])
    t = int(lm[1])
    h = int(lm[2])

    moi1 = [50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65]
    hum1 = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85]
    t1 = [23,24,25,26,27,28]

    recommendation_list = []
    if( ( t not in t1) and ( m not in moi1) and (h not in hum1) ):
        #case when temp is red , moistire is red and hum is red
        recommendation_list.append('Soil Mulching')
        recommendation_list.append('Drainage of the soil')
        recommendation_list.append('Soil Leaching')
        recommendation_list.append('Strip Cropping')
    elif((t not in t1 ) and (m in moi1) and (h not in hum1) ):
        # case when temp is red , moisture is green and hum is red
        recommendation_list.append('Soil Mulching')
        recommendation_list.append('Soil Leaching')
        recommendation_list.append('Strip Cropping')
    elif( (t not in t1) and (m not in moi1) and (h in hum1) ):
        #case when temp is red , moi is red and hum is green
        recommendation_list.append('Soil Mulching')
        recommendation_list.append('Drainage of the soil')
        recommendation_list.append('Strip Cropping')
    elif( (t in t1) and (m not in moi1) and (h not in hum1) ):
        #case when temp is green ,moi is red and hum is red
        recommendation_list.append('Soil Mulching')
        recommendation_list.append('Drainage of the soil')
    elif( (t not in t1) and (m in moi1) and (h in hum1) ):
        #case when temp is red , mois is green and hum is green
        recommendation_list.append('Soil Mulching')
    elif( (t in t1) and (m not in moi1) and (h in hum1) ):
        #case when temp is green , moi is red and hum is green
        recommendation_list.append('Drainage of the soil')
    elif( (t in t1) and (m in moi1) and (h not in hum1) ):
        #case when temp is green , mois is green and hum is red
        recommendation_list.append('Soil Leaching')
    else:
        #case all green
        recommendation_list.append('Maintain Current Conditions')



    # yield prediction using bulk density , moisture value , regression line

    bulk_density = 1.3 # g/cc for that particular soil type in bidadi
    lm = Crop_new.objects.values_list('moisture').filter(farm=f).order_by('-id')[:1]
    yi = yield_tracking.objects.values_list('yield_of_ginger').filter(farm=f)[0]
    value_of_yield = float(yi[0])


    # if value of moisture crosses the 65 mark we are assuming that this will is as bad as below 50 so we are going to minus it from the value
    moisture_average_value = int(lm[0][0])
    if( moisture_average_value > 65 ):
        moisture_average_value = moisture_average_value - 50

    # adding the changes if the temperature and humidity are not in their optimal value
    if( t not in t1 ):
        moisture_average_value = moisture_average_value - 10

    if( h not in hum1):
        moisture_average_value = moisture_average_value - 10

    # here moisture is the galvabinator water content in terms of percentage
    water_in_mm = moisture_average_value * 1.3


    # regression line
    growth = (0.001128)*water_in_mm + (0.663355)

    #assumption that an acre of ginger can give ideally about 3960kg , if it continues to grow at 1

    total_kg_ginger = 3960 * growth

    if( total_kg_ginger > value_of_yield):
        pic = basic + "green.gif"
    elif ( total_kg_ginger == value_of_yield):
        pic = basic + "t.gif"
    else :
        pic = basic + "red.gif"

    diff = total_kg_ginger - value_of_yield

    #update the new yield value to the table
    x = yield_tracking.objects.filter(farm=f).update(yield_of_ginger= str(total_kg_ginger))

    # dynamically rendering the sensor status colors
    if(50 <= m <= 65):
        bm = basic + "g.png"
    else:
        bm = basic + "r.png"

    if(65 <= h <= 85):
        bh = basic + "g.png"
    else:
        bh = basic + "r.png"

    if(23 <= t <= 28):
        bt = basic + "g.png"
    else:
        bt = basic + "r.png"


    return render_to_response(
    'analytics/analytics.html',{'hum':bh,'tem':bt,'moi':bm,'recommendation':recommendation_list,'total_kg':total_kg_ginger,'pic':pic,'diff':diff}
    )

def logout_page(request):
    logout(request)
    return HttpResponseRedirect('https://soildata.pythonanywhere.com/')

"""
Need to convet this view into a POST , but getting csrf token error in the request being sent , need to figure that out + need to do error handling if
the soil parameters do not have any value
"""

def data(request):
    if request.method == 'GET':
        name = request.GET['username']
        #getting the user object who is sending the data to get his farm details

        try:
            user_data = User.objects.get(username=name)
        except User.DoesNotExist:
            return HttpResponse("No such user exist")
        #getting the farm to which the data needs to be sent
        farm_data = Farm_new.objects.get(user=user_data.id)

        #need to add error handling mechanisms where if that values is not entered through the request then default to blank
        temp = request.GET['temperature']
        hum = request.GET['humidity']
        mois = request.GET['moisture']
        name_of_crop = request.GET['name']

        m = [50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65]
        h = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85]
        t = [23,24,25,26,27,28]
        # to instigate a sms to the user to alert him about the condition of the soil when the data is collected itself
        if ( (int(mois) not in m ) or ( int(hum) not in h) or ( int(temp) not in t) ):
            os.chdir(os.path.abspath('/home/soildata/soildata_web/login'))
            output1 = subprocess.call(["python","alert.py"])

        # inserting the crop data into the table
        crop = Crop_new(farm=farm_data,name=str(name_of_crop),temperature=str(temp),humidity=str(hum),moisture=str(mois))
        crop.save()
        return HttpResponse("success")
    return HttpResponseRedirect('/')

