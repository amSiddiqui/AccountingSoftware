#from django.shortcuts import render
from Application.models import *
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

'''
Auth Level 0: Accounting Head 
Auth Level 1: General Accountant
Auth Level 2: Expense Accountant
Auth Level 3: Client Accountant
Auth Lecel 4: None
'''
AUTH_LEVEL = ['Head','General','Expense','Client', None]

value={

    'clientId': None,
    'secret': None,
    'accessToken': None
}

userToken={}
status=[200,403,404]

def check_user(token):
	for e,t in userToken:
		if t is token:
			del userToken[e]
			return True
	return False

def post(*oargs, **okwargs):
	def inner1(func):
		def inner2(*args, **kwargs):
			if args[0].method == 'POST' :
				for k in oargs:
					if k not in args[0].POST.keys():
						return HttpResponse('Invalid Payload',status=400)
					if k is 'token' and k in args[0].POST.keys() and not check_user(args[0].POST['token']):
						return HttpResponse('User not Logged in')
					if k is 'accessToken' and k in args[0].POST.keys() and args[0].POST['accessToken'] is not value['accessToken']:
						return HttpResponse('Invalid access token')
				return func(*args,**kwargs)
			else:
				return HttpResponse(status=status[2])
		return inner2
	return inner1

def get(func):
	def inner(*args, **kwargs):
		if args[0].method == 'GET':
			return func(*args,**kwargs)
		else:
			return HttpResponse(status=status[2])
	return inner

def get_invoice(client,items,invoice):
	res = {
		'client': {
		'id': client['Client_Id'],
		'firstName': client['Fname'],
		'lastName': client['Lname'],
		'countryCode': '+65',
		'phone': client['Phone'],
		'email': client['Email'],
		'address': {
			'address1': client['Address'],
			'city': client['City'],
			'state': client['State'],
			'country': 'USA',
			'pincode': client['Pin_Code'],  
		},
		'lateFeeRate': client['Late_Fee_Rate']
		},
		'id':invoice_id,
		'date': invoice['Date'],
		'amountDue': invoice['Amount_Due'],
		'items' : []
	}

	for itm in items:
		item = {
			'item': itm['Name'],
			'description': itm['Description'],
			'rate': itm['Rate'],
			'quantity': itm['Quantity'],
			'price': itm['Price'] 
		}
		res['items'].append(item)
	return res

#Create Initial init Request:
@csrf_exempt
@post('clientId','secret')
def init(request):
	clientId=request.POST['clientId']
	secret=request.POST['secret']

	if value['clientId'] is None:
    
		value['clientId'] = clientId
		value['secret'] = secret
		token=clientId+str(datetime.now())
		value['accessToken']=make_password(token)

	elif value['clientId'] is not None:

		if(secret == value['secret']):
			token=clientId+str(datetime.now())
			value['accessToken']=make_password(token)
		else:
			return HttpResponse("Invalid Authorisation", status=status[2])
	
	lastClientId = Client.objects.order_by('-Client_Id')
	# TODO: add lastExpense and last InvoiceId
	# lastExpenseId = .objects.order_by()
	lastInvoiceId = Invoice.objects.order_by('-Invoice_Id')
	lastVendorId = Vendor.objects.order_by('-Vendor_Id')

	data={
			'accessToken' : value['accessToken'],
			'data' : {
				'lastClientId' : int(str(lastClientId[0]).split(',')[0].strip()) if len(lastClientId) > 0 else 0,
				'lastInvoiceId' : int(str(lastInvoiceId[0]).split(',')[0].strip()) if len(lastInvoiceId) > 0 else 0,
				'lastVendorId' : int(str(lastVendorId[0]).split(',')[0].strip()) if len(lastVendorId) > 0 else 0
			}
	}

	return JsonResponse(data,safe=False)

# Create login Request:
@csrf_exempt
@post('accessToken','email','password')
def login_user(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        # Is this accessToken encrypted??
        users = User.objects.filter(Email=email).values()

		# for e,enc_p in User.objects.all().values_list('Email','Password'):
		# 	if e == email:
        if users is not None and len(users) == 1:
            user = users[0]
            companies = Company.objects.filter(Company_Id=user['Comp_Id_id']).values()
            if companies is None or len(companies) < 1:
                return HttpResponse('Company is not set', status=406 )
			
            currencies = Currency.objects.filter(Id=companies[0]['Base_Currency_id']).values()
			
            if currencies is None or len( currencies ) < 1 :
               return HttpResponse('Currency is not added', status=406 )
            currency = currencies[0]
			company = companies[0]
			if check_password(password,user['Password']):
				tokenTemp = None
				global userToken  						#Use global keyword to access global variable
				if email in userToken.keys():
					tokenTemp = userToken[email]
				else:
					token=email+str(datetime.now())
					tokenTemp = make_password(token)
					userToken[email] = tokenTemp

				data={
					'name': f"{user['Fname']} {user['Lname']}",
					'email': email,
					'company' :
						{
						'name': company['Company_Name'],
						# TODO: adding country code
						'countryCode': '+88',
						'phone': company['Phone'],
						'email': company['Email'],
						'address': {
							'address1': company['Address_Line'],
							'city': company['City'],
							'state': company['State'],
							# TODO: adding country
							'country': 'Ireland',
							'pincode': company['Pin_Code'],
							},
						'currency': currency['Code'],
						# TODO: adding datefmt
						'datefmt': 'mm/dd/yyyy',
						'taxrate': company['Tax_Rate']
						},
					'token': tokenTemp
				}

				return JsonResponse(data,safe=False)

			else:
				return HttpResponse("Invalid Password", status=status[1])

        else:
            return HttpResponse("User Does Not Exists", status=status[2])

# Create logout Request:
@csrf_exempt
@post('accessToken','token')
def logout(request):
	if request.method == 'POST':
		access_token=request.POST['accessToken']
		uToken=request.POST['token']
		global userToken						#Use global keyword to access global variable

		if ( access_token != value['accessToken'] ):
			return HttpResponse("Invalid Authorisation ", status=status[2])

		if check_user(uToken):
			return HttpResponse('Logout successful')
		return HttpResponse('User is not logged in')


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
				chk = Company.objects.filter(Email=request.POST['email']).values()
				if chk is not None:
				return HttpResponse(" Company Already exists ",status=208) 
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
				printf("Error in company create route.")





@csrf_exempt
@post('accessToken','email')
def user_exists(request):
	# if( request.POST['accessToken'] != value['accessToken'] ):
	# 	return HttpResponse("Invalid Authorization",status=401)
	
	user = User.objects.filter(Email=request.POST['email']).values()
	if user is not None:
		return JsonResponse({
			'exists': 'true' if len(user) != 0 else 'false'
		})
	else :
		return HttpResponse("Database Error",status=500)

@csrf_exempt
@post('accessToken','token','invoice')
def create_invoice(request):
	if value['accessToken'] is not request.POST['accessToken']:
		return HttpResponse('Invalid access token',status=401)
	data = request.POST['invoice']

	invoice = Invoice(Client_Id=data['clientId'], Date=data['date'], Amount_Due=data['amountDue'], 
					Amount_Paid=data['amountPaid'], Total=data['total'], Balance_Due=data['balanceDue'], Notes=data['notes'])
	invoice.save()
	invoice_id = invoice.pk()

	for itm in data['items']:
		item = Item(Name=itm['item'], Description=itm['description'], Rate=itm['rate'], Quantity=itm['quantity'], Price=itm['price'], Invoice_Id=invoice_id)
		item.save()
	return JsonResponse({
		'invoiceId' : invoice_id
	})


@csrf_exempt
@post('accessToken','token')
def fetch_invoice(request,invoice_id):
	if value['accessToken'] is not request.POST['accessToken']:
		return HttpResponse('Invalid access token',status=401)
	
	invoices = Invoice.objects.filter(Invoice_Id=invoice_id).values()
	if invoices is not None and len(invoices) > 0:
		invoice = invoices[0]
		items = Item.objects.filter(Invoice_Id_id=invoice_id).values()
		clients = Client.objects.filter(Client_Id=invoice['Client_Id_id']).values()
		if items is None or len(items) <= 0 or clients is None or len(clients) <= 0:
			return HttpResponse('Client or Items does not exits in database', status=400)

		return JsonResponse(get_invoice(clients[0],items,invoice),safe=True)
	else:
		return HttpResponse('Invalid invoice Id',status=400)
	
@csrf_exempt
@post('accessToken','token','quantity')
def latest_invoice(request):
	qty = request.POST['quantity']
	tempInvoices = Invoice.objects.order_by('-Invoice_Id').values()
	if tempInvoices is not None and len(tempInvoices) >= qty:
		invoices = tempInvoices[:qty]
		res = []
		for inv in invoices:
			client = Client.objects.filter(Client_Id=inv['Client_Id_id']).values()
			items = Item.objects.filter(Invoice_Id_id=inv['Invoice_Id']).values()
			if items is None or len(items) <= 0 or clients is None or len(clients) <= 0:
				return HttpResponse('Client or Items does not exits in database', status=400)
			res.append(get_invoice(client,items,inv))
		return JsonResponse(res,safe=True)
			
	else:
		return HttpResponse('Quantity is out of bound',status=400)
	
@csrf_exempt
@post('accessToken','token','invoices')
def delete_invoice(request):
	resInv = request.POST['invoices']
	for i in resInv:
		Invoice.objects.filter(Invoice_Id=i).delete()
	return HttpResponse('Deleted sucessfully')

@csrf_exempt
@post('accessToken','token','vendor')
def create_vendor(request):
	ven = request.POST['vendor']
	add = ven['addresss']
	# TODO: add country
	vendor = Vendor(Vendor_Name=ven['name'],Email=ven['email'],Phone=ven['phone'],Address=add['address1'],City=add['city'],State=ven['state'],
				Pin_Code=ven['pincode'])
	vendor.save()
	return HttpResponse('Created successfully')

@csrf_exempt
@post('accessToken','token')
def fetch_vendor(request):
	res = { 'vendor': [name for name in Vendor.objects.all().values_list('Vendor_Name')] }
	return JsonResponse(res,safe=True)

@csrf_exempt
@post('accessToken','email')
def accountant_exists(request):
	user = User.objects.filter(Email=request.POST['email']).values()
	if user is not None:
		return JsonResponse({
			'exists': 'true' if len(user) != 0 and AUTH_LEVEL[user['Auth_Level']] != None else 'false'
		})
	else :
		return HttpResponse("Database Error",status=500)
