import urllib2
import cookielib
import os
import sys

sys.path.append('/home/soildata/soildata_web')
os.environ['DJANGO_SETTINGS_MODULE'] = 'soildata_web.settings'


from login.models import Farm_new , Crop_new
from django.contrib.auth.models import User
from getpass import getpass
import sys
import logging
import datetime
from stat import *

message = "please collect data from the farm ! Today's data has not been collected."



number = "9535264688"
LOG_FILENAME = 'sms_updates.log'
logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)


def s():
    username = "9535264688"
    passwd = "kausthub123"


 #logging into the sms site
    url ='http://site24.way2sms.com/Login1.action?'
    data = 'username='+username+'&password='+passwd+'&Submit=Sign+in'
 #For cookies

    cj= cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))

 #Adding header details
    opener.addheaders=[('User-Agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120')]
    try:
        usock =opener.open(url, data)
    except IOError:
        raise Exception('IOERROR')
        return 0
    jession_id =str(cj).split('~')[1].split(' ')[0]
    send_sms_url = 'http://site24.way2sms.com/smstoss.action?'
    send_sms_data = 'ssaction=ss&Token='+jession_id+'&mobile='+number+'&message='+message+'&msgLen=136'
    opener.addheaders=[('Referer', 'http://site25.way2sms.com/sendSMS?Token='+jession_id)]

    try:
        sms_sent_page = opener.open(send_sms_url,send_sms_data)
    except IOError:
        raise Exception('2nd IOERROR')
        return 0
    return 1

if __name__ == '__main__':
    usr = User.objects.get(username="test")
    f = Farm_new.objects.get(user=usr)
    check = Crop_new.objects.values_list('date_of_reading').filter(farm=f).order_by('-id')[0]

    if( check[0] < datetime.date.today()):
        success = s()
        if(success):
            logging.info("sms has been sent to the number 9535264688")
        else:
            logging.info("sms has failed to be sent to number 9535264688")


