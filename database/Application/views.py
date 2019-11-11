# from django.shortcuts import render
from Application.models import User
from Application.models import Country, Quotes, Currency, PhoneCode, Date_Formats,Company
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

value = {

    'clientId': None,
    'secret': None,
    'accessToken': None
}

userToken = None
status = [200, 403, 404]

# Create Initial init Request:
@csrf_exempt
def init(request):

    if request.method == 'POST':
        clientId = request.POST['clientId']
        secret = request.POST['secret']

        if value['clientId'] is None:

            value['clientId'] = clientId
            value['secret'] = secret
            token = clientId+str(datetime.now())
            value['accessToken'] = make_password(token)

            data = {
                'accessToken': value['accessToken']
            }

            return JsonResponse(data, safe=False)

        elif value['clientId'] is not None:

            if(secret == value['secret']):
                token = clientId+str(datetime.now())
                value['accessToken'] = make_password(token)

                data1 = {
                    'accessToken': value['accessToken']
                }

                return JsonResponse(data1, safe=False)

            else:
                return HttpResponse("Invalid Authorisation", status=status[2])

# Create login Request:
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        # Is this accessToken encrypted??
        access_token = request.POST['accessToken']

        if (access_token != value['accessToken']):
            return HttpResponse("Invalid Authorisation ", status=status[2])

        for e, enc_p in User.objects.all().values_list('Email', 'Password'):
            if e == email:
                if check_password(password, enc_p):
                    token = email+str(datetime.now())
                    global userToken  # Use global keyword to access global variable
                    userToken = make_password(token)

                    data = {
                        'profile': [val for val in User.objects.filter(email=e).values()],
                        'userToken': userToken
                    }

                    return JsonResponse(data, safe=False)

                else:
                    return HttpResponse("Invalid Password", status=status[1])

        else:
            return HttpResponse("User Does Not Exists", status=status[2])

# Create logout Request:
@csrf_exempt
def logout(request):
    if request.method == 'POST':
        access_token = request.POST['accessToken']
        uToken = request.POST['userToken']
        global userToken  # Use global keyword to access global variable

        if (access_token != value['accessToken']):
            return HttpResponse(" Invalid Authorisation ", status=status[2])

        elif (userToken is None):
            return HttpResponse(" User not logged in", status=status[1])

        elif (uToken != userToken):
            return HttpResponse(" Invalid userToken ", status=status[2])


@csrf_exempt
def country(request):
    country_code = list()
    country_name = list()
    if request.method == 'POST':
        atoken = request.POST['accessToken']
        if atoken == value['accessToken']:
            for code, c_name in Country.objects.all().values_list('Country_Code', 'Country_Name'):
                country_code.append(code)
                country_name.append(c_name)
            data = {
                'code': country_code,
                'country': country_name,
                'err': 'Successful Fetching'
            }
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ", status=status[2])


@csrf_exempt
def quote(request):
    fn = list()
    ln = list()
    quotes = list()
    if request.method == 'POST':
        atoken = request.POST['accessToken']
        if atoken == value['accessToken']:
            for f, l, q in Quotes.objects.all().values_list('AFName', 'ALName', 'Quote'):
                fn.append(f)
                ln.append(l)
                quotes.append(q)
            data = {
                'FName': fn,
                'LName': ln,
                'quote': quotes,
                'err': 'Successful Fetching'
            }
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ", status=status[2])


@csrf_exempt
def currencies(request):
    currency_code = list()
    currency_name = list()
    if request.method == 'POST':
        atoken = request.POST['accessToken']
        if atoken == value['accessToken']:
            for cc, c in Currency.objects.all().values_list('Code', 'Name'):
                currency_code.append(cc)
                currency_name.append(c)
            data = {
                'code': currency_code,
                'currency': currency_name,
                'err': 'Successful Fetching'
            }
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ", status=status[2])


@csrf_exempt
def phones(request):
    country_name = list()
    iso = list()
    isd = list()
    if request.method == 'POST':
        atoken = request.POST['accessToken']
        if atoken == value['accessToken']:
            for c, i, d in PhoneCode.objects.all().values_list('Country_Name', 'ISO_Code', 'ISD_Code'):
                country_name.append(c)
                iso.append(i)
                isd.append(d)
            data = {
                'Country_Name': country_name,
                'ISO': iso,
                'ISD': isd
            }
            return JsonResponse(data)

    return HttpResponse(" Invalid Authorization ", status=status[2])


@csrf_exempt
def dates(request):
    id = list()
    type = list()
    if request.method == 'POST':
        atoken = request.POST['accessToken']
        if atoken == value['accessToken']:
            for i, t in Date_Formats.objects.all().values_list('Id', 'Types'):
                id.append(i)
                type.append(t)
            data = {
                'Id': id,
                'Type': type,
                'err': 'Successful Fetching'
            }
            return JsonResponse(data)
    return HttpResponse(" Invalid Authorization ", status=status[2])


def company(request):
    if request.method == 'POST':
		atoken=request.POST['accessToken']
		if atoken==value['accessToken']:
			try:
				comp=request.POST.get('company')
				c1=Company(Company_Name=comp['name'],Address_Line=comp['address']['address1'],City=comp['address']['city'],Pin_Code=comp['address']['pincode'],Country_Code=comp['address']['country'],State=comp['address']['state'],Email=comp['email'],Phone=comp['phone'],Date=comp['date'],Tax_Rate=comp['taxrate'],Base_Currency=comp['currency'])
				c1.save()
				if 'Head' in comp['accountants']:
    				x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
					head=request.POST.get('headAcc')
					token = head['email']+str(datetime.now())
					uToken=make_password(token)
					if uToken==userToken:
						return HttpResponse(" User Authorization ",status=status[2])
					global userToken
					userToken=uToken
					h1=User(Fname=head['firstName'],Lname=head['lastName'],Address_Line=head['address']['address1'],City=head['address']['city'],Pin_Code=head['address']['pincode'],State=head['address']['state'],country=head['address']['country'],Country_Code=head['countryCode'],Email=head['email'],Password=head['password'],Phone=head['phone'],Auth_Level=1,Comp_Id=x)
					h1.save()
					
				if 'Client' in comp['accountants']:
    				x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
					client=request.POST.get('clientAcc')
					c1=User(Fname=client['firstName'],Lname=client['lastName'],Address_Line=client['address']['address1'],City=client['address']['city'],Pin_Code=client['address']['pincode'],State=client['address']['state'],country=client['address']['country'],Country_Code=client['countryCode'],Email=client['email'],Password=client['password'],Phone=client['phone'],Auth_Level=2,Comp_Id=x)
					c1.save()
				if 'Expense' in comp['accountants']:
    				x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
					expense=request.post.get('expenseAcc')
					e1=User(Fname=expense['firstName'],Lname=expense['lastName'],Address_Line=expense['address']['address1'],City=expense['address']['city'],Pin_Code=expense['address']['pincode'],State=expense['address']['state'],country=expense['address']['country'],Country_Code=expense['countryCode'],Email=expense['email'],Password=expense['password'],Phone=expense['phone'],Auth_Level=3,Comp_Id=x)
					e1.save()
				if 'Genral' in comp['accountants']:
    				x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
					gen=request.post.get('genralAcc')
					g1=User(Fname=gen['firstName'],Lname=gen['lastName'],Address_Line=gen['address']['address1'],City=gen['address']['city'],Pin_Code=gen['address']['pincode'],State=gen['address']['state'],country=gen['address']['country'],Country_Code=gen['countryCode'],Email=gen['email'],Password=gen['password'],Phone=gen['phone'],Auth_Level=4,Comp_Id=x)
					g1.save()
				data={
					'status':status[0],
					'token'userToken,
					'err':'Successful Creation'
				}
				return JsonResponse(data)

			except:
				return HttpResponse(" Data Already Present ",status=status[1])



	return HttpResponse(" Onvalid Authorization ",status=status[2])