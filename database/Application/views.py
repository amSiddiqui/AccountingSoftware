#from django.shortcuts import render
from Application.models import User
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

value={

	'clientId'   : None,
	'secret'     : None,
	'accessToken': None
}

userToken=None
status=[200,403,404]

#Create Initial init Request:
@csrf_exempt
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
				'accessToken' : value['accessToken']
			}

			return JsonResponse(data,safe=False)

		elif value['clientId'] is not None:

			if(secret == value['secret']):
				token=clientId+str(datetime.now())
				value['accessToken']=make_password(token)

				data1={
					'accessToken' : value['accessToken']
				}

				return JsonResponse(data1,safe=False)

			else:
				return HttpResponse("Invalid Authorisation", status=status[2])

#Create login Request:
@csrf_exempt
def login_user(request):
	if request.method == 'POST':
		email=request.POST['email']
		password=request.POST['password']
		access_token=request.POST['accessToken'] #Is this accessToken encrypted??

		if (access_token != value['accessToken']):
			return HttpResponse("Invalid Authorisation ", status=status[2])

		for e,enc_p in User.objects.all().values_list('Email','Password'):
			if e == email:
				if check_password(password,enc_p):
					token=email+str(datetime.now())
					global userToken  						#Use global keyword to access global variable
					userToken=make_password(token)

					data={
						'profile'  : [val for val in User.objects.filter(email=e).values()],
						'userToken': userToken
					}

					return JsonResponse(data,safe=False)

				else:
					return HttpResponse("Invalid Password", status=status[1])

		else:
			return HttpResponse("User Does Not Exists", status=status[2])

#Create logout Request:
@csrf_exempt
def logout(request):
	if request.method == 'POST':
		access_token=request.POST['accessToken']
		uToken=request.POST['userToken']
		global userToken						#Use global keyword to access global variable

		if ( access_token != value['accessToken'] ):
			return HttpResponse(" Invalid Authorisation ", status=status[2])

		elif (userToken is None):
			return HttpResponse(" User not logged in", status=status[1])

		elif (uToken != userToken):
			return HttpResponse("Invalid userToken ", status=status[2])
