#from django.shortcuts import render
from Application.models import User
from Application.models import Country,Quotes,Currency,PhoneCode,Date_Formats
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime

value={

	'clientId'   : None,
	'secret'     : None,
	'accessToken': None
}

userToken=None
status=[200,403,404]

#Create Initial init Request:
def init(request):

	if request.method == 'POST':
		clientId=request.POST['clientId']
		secret=request.POST['secret']

		if value['clientId'] is None:

			value['clientId'] = clientId
			value['secret'] =secret
			token=clientId+str(datetime.now())
			value['accessToken']=make_password(token)

			data={

				'status'      : status[0],
				'accessToken' : value['accessToken'],
				'err'         : 'Connection Successful'
			}

			return JsonResponse(data,safe=False)

		elif value['clientId'] is not None:

			if(secret == value['secret']):
				token=clientId+str(datetime.now())
				value['accessToken']=make_password(token)

				data1={

					'status'      : status[0],
					'accessToken' : value['accessToken'],
					'err'         : 'Connection Successful'
				}

				return JsonResponse(data1,safe=False)

			else:
				return HttpResponse(str(status[2])+" - Invalid Authorisation")

#Create login Request:
def login_user(request):
	if request.method == 'POST':
		email=request.POST['email']
		password=request.POST['password']
		access_token=request.POST['accessToken'] #Is this accessToken encrypted??

		if (access_token != value['accessToken']):
			return HttpResponse(str(status[2])+" - Invalid Authorisation ")

		for e,enc_p in User.objects.all().values_list('Email','Password'):
			if e == email:
				if check_password(password,enc_p):
					token=email+str(datetime.now())
					global userToken  						#Use global keyword to access global variable
					userToken=make_password(token)

					data={

						'status'   : status[0] ,
						'profile'  : [val for val in User.objects.filter(email=e).values()],
						'userToken': userToken,
						'err'	   : 'Login Successful'
					}

					return JsonResponse(data,safe=False)

				else:
					return HttpResponse(str(status[1])+" - Invalid Password")

		else:
			return HttpResponse(str(status[2])+" - User Does Not Exists")

#Create logout Request:
def logout(request):
	if request.method == 'POST':
		access_token=request.POST['accessToken']
		uToken=request.POST['userToken']
		global userToken						#Use global keyword to access global variable

		if ( access_token != value['accessToken'] ):
			return HttpResponse(str(status[2])+" - Invalid Authorisation ")

		elif (userToken is None):
			return HttpResponse(str(status[1])+ " - User not logged in")

		elif (uToken != userToken):
			return HttpResponse(str(status[2])+" - Invalid userToken ")

def country(request):
    country_code=list()
    country_name=list()
    if request.method== 'POST':
        atoken=request.POST['accessToken']
        if atoken==value['accessToken']:
            for code,c_name in Country.objects.all().values_list('Country_Code','Country_Name'):
                country_code.append(code)
                country_name.append(c_name)
            data={
				'code':country_code,
				'country':country_name,
				'err':'Successful Fetching'
			}
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ",status=status[2])


def quote(request):
    fn=list()
    ln=list()
    quotes=list()
    if request.method== 'POST':
        atoken=request.POST['accessToken']
        if atoken==value['accessToken']:
            for f,l,q in Quotes.objects.all().values_list('AFName','ALName','Qoute'):
                fn.append(f)
                ln.append(l)
            data={
				'FName':fn,
                'LName':ln,
                'quote':q,
				'err':'Successful Fetching'
			}
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ",status=status[2])


def currencies(request):
    currency_code=list()
    currency_name=list()
    if request.method== 'POST':
        atoken=request.POST['accessToken']
        if atoken==value['accessToken']:
            for cc,c in Currency.objects.all().values_list('Code','Name'):
                currency_code.append(cc)
                currency_name.append(c)
            data={
				'code':currency_code,
				'currency':currency_name,
				'err':'Successful Fetching'
			}
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization "+status=status[2])

def phones(request):
    country_name=list()
    iso=list()
    isd=list()
    if request.method== 'POST':
        atoken=request.POST['accessToken']
        if atoken==value['accessToken']:
            for c,i,d in PhoneCode.objects.all().values_list('Country_Name','ISO_Code','ISD_Code'):
                country_name.append(c)
                iso.append(i)
                isd.append(d)
            data={
				'Country_Name':country_name,
				'ISO':iso,
				'ISD':isd
			}
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ",status=status[2])

def dates(request):
    id=list()
    type=list()
    if request.method=='POST':
        atoken=request.POST['accessToken']
        if atoken==value['accessToken']:
            for i,t in Date_Formats.objects.all().values_list('Id','Types'):
                id.append(i)
                type.append(t)
            data={
				'Id':id,
				'Type':type,
				'err':'Successful Fetching'
			}
            return JsonResponse(data)
    return HttpResponse(" Invalid Authorization ",status=status[2])

