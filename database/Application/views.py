#from django.shortcuts import render
from Application.models import *
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.hashers import make_password,check_password
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import date, timedelta
from django.db.models import Sum
import json

'''
Auth Level 0: Accounting Head
Auth Level 1: General Accountant
Auth Level 2: Expense Accountant
Auth Level 3: Client Accountant
Auth Lecel 4: None
'''

AUTH_LEVEL = ['Head','General','Expense','Client', None]

DATE_FORMAT = {
	'little_endian': 'dd/mm/yyyy',
	'middle_endian': 'mm/dd/yyyy',
	'big_endian': 'yyyy/mm/dd',
}

value={

    'clientId': None,
    'secret': None,
    'accessToken': 'not an accessToken'
}

userToken={}
status=[200,403,404]

def check_user(token):
	for (e,t) in userToken.items():
		if t == token:
			return e
	return None

def delete_user(token):
	email = check_user(token)
	print(userToken,email)
	if email is not None:
		del userToken[email]
		return True
	return False

def post(*oargs, **okwargs):
	def inner1(func):
		def inner2(*args, **kwargs):
			if args[0].method == 'POST' :
				args[0].POST = json.loads(args[0].body)
				for k in oargs:
					if k not in args[0].POST.keys():
						return HttpResponse('Invalid Payload',status=400)
					if k == 'token' and k in args[0].POST.keys() and not check_user(args[0].POST['token']):
						return HttpResponse('User not Logged in',status=400)
					if k == 'accessToken' and k in args[0].POST.keys() :
						if args[0].POST['accessToken'] != value['accessToken']:
							return HttpResponse('Invalid access token',status=400)
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

def get_iso_date(date_format, date_data):
	d = [ int(x) for x in date_data.strip().split('/') if len( x.strip() ) != 0 ]
	if len(d) != 3:
		raise Exception('Invalid date data')
	if DATE_FORMAT['big_endian'] == date_format.strip(): # yyyy/mm/dd
		return date(d[0],d[1],d[2])
	elif DATE_FORMAT['little_endian'] == date_format.strip(): # dd/mm/yyyy
		return date(d[2],d[1],d[0])
	elif DATE_FORMAT['middle_endian'] == date_format.strip(): # 'mm/dd/yyyy'
		return  date(d[2],d[0],d[1])
	else :
		raise Exception('Invalid date format')

def get_date(date_format, date_data):
	if DATE_FORMAT['big_endian'] == date_format.strip(): # yyyy/mm/dd
		return date_data.strftime("%Y/%m/%d")
	elif DATE_FORMAT['little_endian'] == date_format.strip(): # dd/mm/yyyy
		return date_data.strftime("%d/%m/%Y")
	elif DATE_FORMAT['middle_endian'] == date_format.strip(): # 'mm/dd/yyyy'
		return date_data.strftime("%m/%d/%Y")
	else :
		raise Exception('Invalid date format')

def get_invoice(client,items,invoice):
	tempDate = invoice['Date']
	diff = (date.today() - tempDate).days
	dueTime = 0
	if (invoice['Balance_Due'] > 0 and diff > client['Day_Limit']):
		dueTime = diff - client['Day_Limit']
	res = {
		'client': {
		'id': client['Client_Id'],
		'firstName': client['Fname'],
		'lastName': client['Lname'],
		'countryCode': client['Country_Code'],
		'phone': client['Phone'],
		'email': client['Email'],
		'address': {
			'address1': client['Address_Line'],
			'city': client['City'],
			'state': client['State'],
			'country': client['Country_Name'],
			'pincode': client['Pin_Code'],
		},
		'lateFeeRate': client['Late_Fee_Rate'],
		'dayLimit': client['Day_Limit'],
		},
		'id':invoice['Invoice_Id'],
		'date': get_date( invoice['datefmt'], invoice['Date'] ),
		'amountDue': invoice['Amount_Due'],
		'amountPaid': invoice['Amount_Paid'],
		'balanceDue': invoice['Balance_Due'],
		'total': invoice['Total'],
		'notes': invoice['Notes'],
		'dueTime': dueTime,
		'items' : items
	}
	return res

@csrf_exempt
@post('accessToken')
def check_token(request):
	try:
		return JsonResponse({
			'valid': check_user(request.POST['token'])
		},safe=True)
	except :
		return HttpResponse('Please provide user token',status=400)
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

	lastClientId = Client.objects.all().order_by('-Client_Id')
	lastExpenseId = Expense.objects.all().order_by('-Expense_Id')
	lastInvoiceId = Invoice.objects.all().order_by('-Invoice_Id')
	lastVendorId = Vendor.objects.all().order_by('-Vendor_Id')

	data={
			'accessToken' : value['accessToken'],
			'data' : {
				'lastClientId' : int(str(lastClientId[0]).split(',')[0].strip()) if len(lastClientId) > 0 else 0,
				'lastInvoiceId' : int(str(lastInvoiceId[0]).split(',')[0].strip()) if len(lastInvoiceId) > 0 else 0,
				'lastVendorId' : int(str(lastVendorId[0]).split(',')[0].strip()) if len(lastVendorId) > 0 else 0,
				'lastExpenseId' : int(str(lastExpenseId[0]).split(',')[0].strip()) if len(lastExpenseId) > 0 else 0
			}
	}

	return JsonResponse(data,safe=False)

# Create login Request:
@csrf_exempt
@post('accessToken','email','password')
def login_user(request):
	email = request.POST['email']
	password = request.POST['password']
	# Is this accessToken encrypted??
	# access_token = request.POST['accessToken']

	# if (access_token != value['accessToken']):
	# 	return HttpResponse("Invalid Authorisation ", status=status[2])
	users = User.objects.filter(Email=email).values()
	# for e,enc_p in User.objects.all().values_list('Email','Password'):
	# 	if e == email:
	if users is not None and len(users) == 1:
		user = users[0]
		companies = Company.objects.filter(Company_Id=user['Comp_Id_id']).values()
		if companies is None or len(companies) < 1:
			return HttpResponse('Company is not set', status=406 )

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
					'countryCode': company['Country_Code'],
					'phone': company['Phone'],
					'email': company['Email'],
					'address': {
						'address1': company['Address_Line'],
						'city': company['City'],
						'state': company['State'],
						'country': company['Country_Name'],
						'pincode': company['Pin_Code'],
						},
					'currency': company['Base_Currency'],
					'datefmt': company['Date_Format'],
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
		uToken=request.POST['token']						#Use global keyword to access global variable

		if ( access_token != value['accessToken'] ):
			return HttpResponse("Invalid Authorisation ", status=status[2])

		if delete_user(uToken):
			return HttpResponse('Logout successful')
		return HttpResponse('User is not logged in')


@csrf_exempt
@post('accessToken')
def country(request):
	country_code = list()
	country_name = list()
	for code, c_name in Country.objects.all().values_list('Country_Code', 'Country_Name'):
		country_code.append(code)
		country_name.append(c_name)
	data = {
		'code': country_code,
		'country': country_name
	}
	return JsonResponse(data)


@csrf_exempt
@post('accessToken')
def quote(request):
	fn = list()
	ln = list()
	quotes = list()
	for f, l, q in Quotes.objects.all().values_list('AFName', 'ALName', 'Quote'):
		fn.append(f)
		ln.append(l)
		quotes.append(q)
	data = {
		'fName': fn,
		'lName': ln,
		'quote': quotes
	}
	return JsonResponse(data)


@csrf_exempt
@post('accessToken')
def currencies(request):
	currency_code = list()
	currency_name = list()
	currency_sym = list()
	for cc, c, sy in Currency.objects.all().values_list('Code', 'Name', 'Symbol'):
		currency_code.append(cc)
		currency_name.append(c)
		currency_sym.append(sy)
	data = {
		'code': currency_code,
		'currency': currency_name,
		'symbol': currency_sym
	}
	return JsonResponse(data)


@csrf_exempt
@post('accessToken')
def phones(request):
	country_name = list()
	iso = list()
	isd = list()
	for c, i, d in PhoneCode.objects.all().values_list('Country_Name', 'ISO_Code', 'ISD_Code'):
		country_name.append(c)
		iso.append(i)
		isd.append(d)
	data = {
		'countryName': country_name,
		'ISO': iso,
		'ISD': isd
	}
	return JsonResponse(data)


@csrf_exempt
@post('accessToken')
def dates(request):
	data = [v for v in DATE_FORMAT.values() ]
	return JsonResponse({ 'dateFormat' : data },safe=True)

@csrf_exempt
@post('accessToken','company')
def company(request):
	request.POST = request.POST.get('company')
	try:
		comp=request.POST.get('company')

		datefmt = comp['datefmt']
		c1 = Company(Company_Name=comp['name'],Address_Line=comp['address']['address1'],City=comp['address']['city'],
			Pin_Code=comp['address']['pincode'],Country_Name=comp['address']['country'], Country_Code=comp['countryCode'],
			State=comp['address']['state'],Email=comp['email'],Phone=comp['phone'],
			Tax_Rate=comp['taxrate'],Base_Currency=comp['currency'],Date_Format=datefmt)
		c1.save()
		comp_id = c1.pk

		if 'Head' in comp['accountants']:
			# x = Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
			head=request.POST.get('headAcc')
			token = head['email']+str(datetime.now())
			uToken = make_password(token)

			global userToken
			email = head['email']
			userToken[email] = uToken

			h1 = User(Fname=head['firstName'],Lname=head['lastName'],Address_Line=head['address']['address1'],
				City=head['address']['city'],Pin_Code=head['address']['pincode'],State=head['address']['state'],
				Country_Name=head['address']['country'],Country_Code=head['countryCode'],Email=head['email'],
				Password=make_password(head['password']),Phone=head['phone'],Auth_Level=0,Comp_Id_id=comp_id)
			h1.save()


		if 'Client' in comp['accountants']:
			# x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
			client=request.POST.get('clientAcc')
			token = client['email']+str(datetime.now())
			uToken=make_password(token)

			userToken[email]=uToken

			c1 = User(Fname=client['firstName'],Lname=client['lastName'],Address_Line=client['address']['address1'],
				City=client['address']['city'],Pin_Code=client['address']['pincode'],State=client['address']['state'],
				Country_Name=client['address']['country'],Country_Code=client['countryCode'],Email=client['email'],
				Password=make_password(client['password']),Phone=client['phone'],Auth_Level=1,Comp_Id_id=comp_id)

			c1.save()

		if 'Expense' in comp['accountants']:
			# x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
			expense=request.post.get('expenseAcc')
			token=expense['email']+str(datetime.now())
			uToken=make_password(token)

			userToken[email]=uToken

			e1 = User(Fname=expense['firstName'],Lname=expense['lastName'],Address_Line=expense['address']['address1'],
				City=expense['address']['city'],Pin_Code=expense['address']['pincode'],State=expense['address']['state'],
				Country_Name=expense['address']['country'],Country_Code=expense['countryCode'],Email=expense['email'],
				Password=make_password(expense['password']),Phone=expense['phone'],Auth_Level=2,Comp_Id_id=comp_id)
			e1.save()

		if 'Genral' in comp['accountants']:
			# x=Company.objects.filter(Company_Name=comp['name']).values_list('Company_Id')
			gen=request.post.get('genralAcc')
			token=gen['email']+str(datetime.now())
			uToken=make_password(token)

			userToken[email]=uToken

			g1 = User(Fname=gen['firstName'],Lname=gen['lastName'],Address_Line=gen['address']['address1'],
				City=gen['address']['city'],Pin_Code=gen['address']['pincode'],State=gen['address']['state'],
				Country_Name=gen['address']['country'],Country_Code=gen['countryCode'],Email=gen['email'],
				Password=make_password(gen['password']),Phone=gen['phone'],Auth_Level=3,Comp_Id_id=comp_id)
			g1.save()

		print('User created ')
		print('token Created: ', userToken[email])
		data={
			'token' : uToken
		}
		return JsonResponse(data)

	except:
		return HttpResponse('Company Creation error', status=400)

@csrf_exempt
@post('accessToken','email','phone','name')
def company_exists(request):
	email = request.POST['email']
	phone = request.POST['phone']
	name = request.POST['name']
	name_exists = len( Company.objects.filter(Company_Name=name).values() ) > 0
	email_exists = len( Company.objects.filter(Company_Name=email).values() ) > 0
	phone_exists = len( Company.objects.filter(Company_Name=phone).values() ) > 0

	return JsonResponse({
		'nameExists':name_exists,
		'emailExists':email_exists,
		'phoneExists':phone_exists
	},safe=True)

@csrf_exempt
@post('accessToken','email')
def user_exists(request):
	user = User.objects.filter(Email=request.POST['email']).values()
	if user is not None:
		return JsonResponse({
			'exists': True if len(user) != 0 else False
		})
	else :
		return HttpResponse("Database Error",status=500)

#Creates invoice

@csrf_exempt
@post('accessToken','token','invoice', 'datefmt')
def create_invoice(request):
	data = request.POST['invoice']
	datefmt = request.POST['datefmt']
	if (len(data['items']) == 0):
		return HttpResponse('No items provided ', status=400)
	invoice = Invoice(Client_Id=Client.objects.get(Client_Id=data['clientId']), Date=get_iso_date(datefmt, data['date']), Amount_Due=data['amountDue'],
					Amount_Paid=data['amountPaid'], Total=data['total'], Balance_Due=data['balanceDue'], Notes=data['notes'],
					Date_Format=datefmt)
	invoice.save()
	for itm in data['items']:
		item_pk = 0
		db_items = Item.objects.filter(Name=itm['item']).values();
		if (len(db_items) > 0):
			item_pk=db_items[0]['Item_Id']
		else:
			item = Item(Name=itm['item'], Description=itm['description'], Rate=itm['rate'])
			item.save()
			item_pk = item.pk
		
		item_invoice = Item_Invoice(Item_Id_id=item_pk, Invoice_Id_id=invoice.pk, Quantity=itm['quantity'], Price=itm['price'])
		item_invoice.save()
	return JsonResponse({
		'invoiceId' : invoice.pk
	})

#Fetch invoice
@csrf_exempt
@post('accessToken','token')
def fetch_invoice(request,invoice_id):

	invoices = Invoice.objects.filter(Invoice_Id=invoice_id).values()
	if invoices is not None and len(invoices) > 0:
		invoice = invoices[0]
		item_invoices = Item_Invoice.objects.filter(Invoice_Id_id=invoice['Invoice_Id']).values()
		items = []
		for itm in item_invoices:
			item = Item.objects.filter(Item_Id=itm['Item_Id_id']).values()[0]
			item['quantity'] = itm['Quantity']
			item['price'] = itm['Price']
			items.append(item)

		clients = Client.objects.filter(Client_Id=invoice['Client_Id_id']).values()
		if items is None or len(items) <= 0 or clients is None or len(clients) <= 0:
			return HttpResponse('Client or Items does not exits in database', status=400)

		invoice['datefmt'] = invoice['Date_Format']
		return JsonResponse(get_invoice(clients[0],items,invoice),safe=True)
	else:
		return HttpResponse('Invalid invoice Id',status=400)

#Get latest invoice
@csrf_exempt
@post('accessToken','token','quantity','datefmt')
def latest_invoice(request):
	qty = request.POST['quantity']
	tempInvoices = Invoice.objects.all().order_by('-Invoice_Id').values()
	invoices = tempInvoices
	res = []
	for inv in invoices:
		if qty == 0:
			break
		qty -= 1
		client = Client.objects.filter(Client_Id=inv['Client_Id_id']).values()
		items = []
		item_invoice = Item_Invoice.objects.filter(Invoice_Id_id=inv['Invoice_Id']).values()
		for itm in item_invoice:
			item = Item.objects.filter(Item_Id=itm['Item_Id_id']).values()[0]
			item['quantity'] = itm['Quantity']
			item['price'] = itm['Price']
			items.append(item)

		inv['datefmt'] = request.POST['datefmt']
		if items is None or len(items) <= 0 or client is None or len(client) <= 0:
			return HttpResponse('Client or Items does not exits in database', status=400)
		res.append(get_invoice(client[0],items,inv))
	
	return JsonResponse({'invoices': res},safe=True)


#Deletes the invoice
@csrf_exempt
@post('accessToken','token','invoices')
def delete_invoice(request):
	resInv = request.POST['invoices']
	for i in resInv:
		Invoice.objects.filter(Invoice_Id=i).delete()
		items = Item_Invoice.objects.filter(Invoice_Id_id=i).delete()
	return HttpResponse('Deleted sucessfully')

#Create Vendor
@csrf_exempt
@post('accessToken','token','vendor')
def create_vendor(request):
	ven = request.POST['vendor']
	add = ven['addresss']
	vendor = Vendor(Vendor_Name=ven['name'],Email=ven['email'],Phone=ven['phone'],Address_Line=add['address1'],City=add['city'],State=ven['state'],
				Pin_Code=ven['pincode'], Country_Name=add['country'], Country_Code=ven['countryCode'])
	vendor.save()
	return HttpResponse('Created successfully')

#Fetch Vendor
@csrf_exempt
@post('accessToken','token')
def fetch_vendor(request):
	res = { 'vendor': [name for name in Vendor.objects.all().values_list('Vendor_Name')] }
	return JsonResponse(res,safe=True)

#Fetch Vendor
@csrf_exempt
@post('accessToken','token','vendors')
def fetch_vendor_Id(request):
	res = []
	vendors = Vendor.objects.all().values()
	if vendors is None or len(vendors) <= 0:
		return HttpResponse('Invalid Payload',status=400)
	for name in request.POST['vendors']:
		res_pat = {
			'name':name,
			'id':-1
		}
		for ven in vendors:
			if name == ven['Vendor_Name']:
				res_pat['id'] = ven['Vendor_Id']
				res.append(res_pat)

	return JsonResponse(res,safe=True)

#Fetch Vendor
@csrf_exempt
@post('accessToken','email')
def accountant_exists(request):
	user = User.objects.filter(Email=request.POST['email']).values()
	if user is not None:
		return JsonResponse({
			'exists': True if len(user) != 0 else False
		})
	else :
		return HttpResponse("Database Error",status=500)



# Category routes
@csrf_exempt
@post('accessToken', 'token', 'category')
def category_create(request):
	category = request.POST['category']
	cat = Category(Type=category)
	cat.save()
	return HttpResponse('Created successfully')

@csrf_exempt
@post('accessToken', 'token')
def category_fetch(request):
	res = {'categories': [cat for cat in Category.objects.all().values_list('Type')]}
	return JsonResponse(res, safe=True)


# Expense Routes
# Creation
@csrf_exempt
@post('accessToken', 'token', 'client')
def expense_create(request):
	exp = request.POST['expense']
	expense = Expense(Category_Id=Category.objects.filter(Type=exp['category']).values()[0]['Category_Id'], Date=get_iso_date(request.POST['datefmt'], exp['date']), Vendor_Id=Vendor.objects.filter(Vendor_Name=exp['vendor'])[0].Vendor_Id,Description=exp['description'], Amount=float(exp['amount']))
	expense.save()
	return HttpResponse('Created Successfully')


def _get_expense(expense):
	categories = Category.objects.filter(Category_Id=expense['Category_Id_id']).values()
	category = ''
	if categories is not None and len( categories ) > 0:
		category = categories[0]['Type']
	return {
			'category': category,
			'date': expense['Date'],
			'description': expense['Description'],
			'amount': expense['Amount'],
			'vendor': Vendor.objects.filter(pk=expense['Vendor_Id_id']).values()[0],
			'id': expense['Expense_Id']
		}

# fetch_latest
@csrf_exempt
@post('accessToken', 'token', 'quantity')
def expense_latest(request):
	qty = request.POST['quantity']
	all_expense = Expense.objects.all().order_by("-Expense_Id").values()
	expenses = all_expense
	res = {'expenses': []}
	for exp in expenses:
		if qty == 0:
			break
		qty -= 1
		expense = _get_expense(exp)
		res['expenses'].append(expense)
	return (JsonResponse(res, safe=True))


@csrf_exempt
@post('accessToken', 'token')
def expense_fetch(request, expense_id):
	exp = Expense.objects.filter(Expense_Id=expense_id).values()[0]
	if (exp is not None):
		res = {'expense': _get_expense(exp)}
		return JsonResponse(res, safe=True)
	else:
		return HttpResponse('Expense does not exists', status=400)


@csrf_exempt
@post('accessToken', 'token', 'expense')
def expense_update(request, expense_id):
	exp = Expense.objects.get(pk=expense_id)
	if (exp is not None):
		new_exp = request.POST['expense']
		
		datefmt = request.POST['datefmt']
		exp.Category_Id = Category.objects.get(Type=new_exp['category'])
		exp.Date = get_iso_date(datefmt, new_exp['date'])
		vendors = Vendor.objects.filter(Vendor_Name=new_exp['vendor']).values()
		if (not (vendors is not None and len(vendors) > 0)):
			return HttpResponse('Vendor does not exists', status=400)
		exp.Vendor_Id = Vendor.objects.get(Vendor_Name=new_exp['vendor'])
		exp.Description = new_exp['description']
		exp.Amount = new_exp['amount']
		exp.save()
		return HttpResponse('Save successfully')
	else:
		return HttpResponse('Expense does not exists', status=400)


@csrf_exempt
@post('accessToken', 'token', 'expenses')
def expense_delete(request):
	exp_ids = request.POST['expenses']
	for ids in exp_ids:
		Expense.objects.get(Expense_Id=ids).delete()
	return HttpResponse('Successfully Deleted')



# Client Routes

@csrf_exempt
@post('accessToken', 'token', 'client')
def client_create(request):
	cli = request.POST['client']
	client = Client(Fname=cli['firstName'], Lname=cli['lastName'], Address_Line=cli['address']['address1'],
	 City=cli['address']['city'], Pin_Code=cli['address']['pincode'], State=cli['address']['state'], Country_Name=cli['address']['country'],
	Day_Limit=cli['dayLimit'], Email=cli['email'], Phone=cli['phone'], Country_Code=cli['countryCode'], Late_Fee_Rate=cli['lateFeeRate'])
	client.save()
	return HttpResponse('Created Successfully')


def _get_client_stats(client):
	invoices = Invoice.objects.filter(Client_Id_id = client['Client_Id']).values();
	res = {}
	overdue = 0
	outstanding = 0
	total = 0
	totalDueTime = 0
	for invo in invoices:
		outstanding += invo['Balance_Due']
		total += invo['Total']
		tempDate = invo['Date']
		diff = (date.today() - tempDate).days
		if (diff > client['Day_Limit'] and invo['Balance_Due'] > 0):
			totalDueTime += (diff - client['Day_Limit'])
			overdue += invo['Balance_Due']
	
	return {'outstanding': outstanding, 'overdue': overdue, 'total': total, 'dueTime': totalDueTime}



def _get_client( client ):
	return {
		'id': client['Client_Id'],
		'firstName': client['Fname'],
		'lastName': client['Lname'],
		'countryCode': client['Country_Code'],
		'phone': client['Phone'],
		'email': client['Email'],
		'address': {
			'address1': client['Address_Line'],
			'city': client['City'],
			'state': client['State'],
			'country': client['Country_Name'],
			'pincode': client['Pin_Code'],
		},
		'lateFeeRate': client['Late_Fee_Rate'],
		'dayLimit': client['Day_Limit']
	}

@csrf_exempt
@post('accessToken', 'token', 'quantity')
def client_latest(request):
	qty = request.POST['quantity']
	all_client = Client.objects.all().order_by("-Client_Id").values()
	if all_client is not None and len(all_client) > 0:
		res = {'clients': []}
		for client in all_client:
			if qty == 0:
				break
			qty -= 1
			cli = _get_client(client)
			cli['stats'] = _get_client_stats(client)
			res['clients'].append(cli)
		return (JsonResponse(res, safe=True))
	else:
		return HttpResponse('Quatity Requested is out of bounds', status=400)




@csrf_exempt
@post('accessToken', 'token')
def client_fetch(request, client_id):
	clis = Client.objects.filter(Client_Id=client_id).values()
	invs = Invoice.objects.filter(Client_Id_id=client_id).values() 
	if clis is None or len( clis ) <= 0:
		return HttpResponse('Client does not exists', status=400)
	cli = clis[0]
	invoices = []
	for inv in invs:
		item_invo = Item_Invoice.objects.filter(Invoice_Id_id=inv['Invoice_Id']).values()
		items = []
		for itm in item_invo:
			item = Item.objects.filter(Item_Id=itm['Item_Id_id']).values()[0]
			item['quantity'] = itm['Quantity']
			item['price'] = itm['Price']
			items.append(item)
		inv['datefmt'] = request.POST['datefmt']
		invoice = get_invoice(cli, items, inv)
		invoices.append(invoice)

	if (cli is not None):
		tempCli = _get_client(cli)
		tempCli['stats'] = _get_client_stats(cli)
		res = {'client': tempCli, 'invoices': invoices}
		return JsonResponse(res, safe=True)
	else:
		return HttpResponse('Client does not exists', status=400)


@csrf_exempt
@post('accessToken', 'token', 'client')
def client_update(request, client_id):
	cli = Client.objects.get(pk=client_id)
	if (cli is not None):
		new_cli = request.POST['client']
		address = new_cli['address']
		cli.Fname = new_cli['firstName']
		cli.Lname = new_cli['lastName']
		cli.Address_Line = address['address1']
		cli.City = address['city']
		cli.Pin_Code = address['pincode']
		cli.State = address['State']
		cli.Country_Name = address['country']
		cli.Country_Code = new_cli['countryCode']
		cli.Late_Fee_rate = new_cli['lateFeeRate']
		cli.Phone = new_cli['phone']
		cli.Email = new_cli['email']
		cli.Day_Limit = new_cli['dayLimit']
		cli.save()
		return HttpResponse('Save successfully')
	else:
		return HttpResponse('Expense does not exists', status=400)

@csrf_exempt
@post('accessToken', 'token', 'clients')
def client_delete(request):
	cli_ids = request.POST['clients']
	for ids in cli_ids:
		Client.objects.get(Client_Id=ids).delete()
		invoices = Invoice.objects.filter(Client_Id_id=ids)
		for invo in invoices:
			invo_id = invo.Invoice_Id
			invo.delete()
			items = Item_Invioce.objects.filter(Invoice_Id_id=invo_id)
			for itm in items:
				itm.delete()

	return HttpResponse('Successfully Deleted')
		

def _get_invoices_by_year(invoices):
	invs_y = [invoices[0]]
	invs = []
	curr_year = invs_y[0]['Date'].year
	flag = False
	for i in invoices:
		y = i['Date'].year
		invs.append(i)
		if y < curr_year:
			if flag :
				break
			invs_y.append(i)
			invs.append(i)
			curr_year = y
			flag = True
	return (len(invs_y),invs)


@csrf_exempt
@post('accessToken','token','startMonth','endMonth')
def report_outstandingRevenue(request):
	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	currMonth = date.today().month

	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	invoices = Invoice.objects.all().order_by('-Date').values()
	if invoices is None or len( invoices ) <= 0 :
		return HttpResponse('Invoice not found',status=400)

	invs_y,invs = _get_invoices_by_year(invoices)
	curr_year = invs[0]['Date'].year

	if invs_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)

	res = {
		'revenue': 0
	}

	if not cycleE and not cycleS:
		for i in range( 0, len(invs)):
			inv = invs[i]
			if curr_year != inv['Date'].year :
				break
			if sMonth <= inv['Date'].month and eMonth >= inv['Date'].month :
				res['revenue'] += inv['Balance_Due']
	elif cycleE and not cycleS:
		for i in range( 0 , len( invs ) ):
			inv = invs[i]
			if eMonth >= inv['Date'].month and curr_year == inv['Date'].year :
				res['revenue'] += inv['Balance_Due']
			elif sMonth <= inv['Date'].month and curr_year != inv['Date'].year :
				res['revenue'] += inv['Balance_Due']
	elif cycleS and cycleE:
		for i in range( 0 , len( invs ) ):
			inv = invs[i]
			if sMonth <= inv['Date'].month and curr_year != inv['Date'].year and eMonth >= inv['Date'].month :
				res['revenue'] += inv['Balance_Due']

	return JsonResponse(res,safe=True)

@csrf_exempt
@post('accessToken','token','startMonth','endMonth')
def report_overdue(request):
	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	currMonth = date.today().month

	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	invoices = Invoice.objects.all().order_by('-Date').values()
	if invoices is None or len( invoices ) <= 0 :
		return HttpResponse('Invoice not found',status=400)

	invs_y,invs = _get_invoices_by_year(invoices)
	curr_year = invs[0]['Date'].year

	if invs_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)

	res = {
		'overdue': 0
	}

	check_limit = lambda d, limit: ( date.today() - d ).days > limit

	if not cycleE and not cycleS:
		for i in range( 0, len(invs)):
			inv = invs[i]
			clients = Client.objects.filter(Client_Id=inv['Client_Id_id']).values()
			if clients is None or len(clients) <= 0:
				break
			if curr_year != inv['Date'].year :
				break

			if sMonth <= inv['Date'].month and eMonth >= inv['Date'].month and check_limit(inv['Date'], clients[0]['Day_Limit']):
				res['overdue'] += inv['Balance_Due']
	elif cycleE and not cycleS:
		for i in range( 0 , len( invs ) ):
			inv = invs[i]

			clients = Client.object().filter(Client_Id=inv['Client_Id_id'])
			if clients is None or len(clients) <= 0:
				break

			if eMonth >= inv['Date'].month and curr_year == inv['Date'].year and check_limit(inv['Date'], clients[0]['Day_Limit']):
				res['overdue'] += inv['Balance_Due']
			elif sMonth <= inv['Date'].month and curr_year != inv['Date'].year and check_limit(inv['Date'], clients[0]['Day_Limit']):
				res['overdue'] += inv['Balance_Due']
	elif cycleS and cycleE:
		for i in range( 0 , len( invs ) ):
			inv = invs[i]

			clients = Client.object().filter(Client_Id=inv['Client_Id_id'])
			if clients is None or len(clients) <= 0:
				break

			if sMonth <= inv['Date'].month and curr_year != inv['Date'].year and eMonth >= inv['Date'].month and check_limit(inv['Date'], clients[0]['Day_Limit']):
				res['overdue'] += inv['Balance_Due']

	return JsonResponse(res,safe=True)

@csrf_exempt
@post('accessToken','token','startMonth','endMonth')
def report_profit(request):

	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	currMonth = date.today().month

	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	invoices = Invoice.objects.all().order_by('-Date').values()
	total_sum = Invoice.objects.aggregate(Sum('Total'))['Total__sum']

	if invoices is None or len( invoices ) <= 0 :
		return HttpResponse('Invoice not found',status=400)

	invs_y,invs = _get_invoices_by_year(invoices)
	curr_year = invs[0]['Date'].year
	if invs_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)

	res = {
		'profit': []
	}
	
	temp_prof = []

	for i in range( 0, len(invs)):
		prof_pat = {
			'id': '',
			'prof': 0
		}
		inv = invs[i]
		temp_date = inv['Date']
		temp_month = temp_date.month
		temp_year = temp_date.year
		temp_key = f"{temp_month}/{temp_year}"

		idx = -1
		for j in range(0, len(temp_prof)):
			if temp_prof[j]['id'] == temp_key:
				idx = j
				break
		if idx == -1:
			prof_pat['id'] = temp_key
			temp_prof.append(prof_pat)
			idx = len(temp_prof) - 1
			
		if not cycleE and not cycleS:
			if curr_year != temp_year :
				break
			if sMonth <= temp_month and eMonth >= temp_month:
				temp_prof[idx]['prof'] += inv['Balance_Due']
		elif cycleE and not cycleS:
			if eMonth >= temp_month and curr_year == temp_year:
				temp_prof[idx]['prof'] += inv['Balance_Due']
			elif sMonth <= temp_month and curr_year != temp_year:
				temp_prof[idx]['prof'] += inv['Balance_Due']
		elif cycleS and cycleE:
			if sMonth <= temp_month and curr_year != temp_year and eMonth >= temp_month:
				temp_prof[idx]['prof'] += inv['Balance_Due']

	for prof in temp_prof:
		res['profit'].append( total_sum - prof['prof'])
	return JsonResponse(res,safe=True)

@csrf_exempt
@post('accessToken','token','startMonth','endMonth','quantity')
def report_revenue(request):

	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	qty = request.POST['quantity']
	currMonth = date.today().month

	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	invoices = Invoice.objects.all().order_by('-Date').values()

	if invoices is None or len( invoices ) <= 0 :
		return HttpResponse('Invoice not found',status=400)

	invs_y,invs = _get_invoices_by_year(invoices)
	curr_year = invs[0]['Date'].year
	if invs_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)

	res = {
		'revenue':[],
		'totalRevenue': 0
	}

	'''
	revPat = {
		'client':
		'revenue':
	}
	'''
	temp_rev = []

	rev = 0
	for i in range( 0, len(invs)):
		if qty == 0:
			break
		qty -= 1

		inv = invs[i]
		temp_date = inv['Date']
		temp_month = temp_date.month
		temp_year = temp_date.year
		clients = Client.objects.filter(Client_Id=inv['Client_Id_id']).values()
		if clients is None or len(clients) <= 0:
			return HttpResponse('Database is correpted', status=500)

		name = f"{clients[0]['Fname']} {clients[0]['Lname']}"
		rev_pat = {
			'client': name,
			'revenue': 0,
			'id' : clients[0]['Client_Id']
		}

		idx = -1
		for j in range( 0, len( temp_rev ) ):
			r = temp_rev[j]
			if r['id'] == rev_pat['id']:
				rev_pat = r
				idx = j
				break
		if idx == -1:
			temp_rev.append(rev_pat)
			idx = len( temp_rev ) - 1

		if not cycleE and not cycleS:
			if curr_year != temp_year :
				break
			if sMonth <= temp_month and eMonth >= temp_month:
				rev += inv['Balance_Due']
				temp_rev[idx]['revenue'] += inv['Balance_Due']
		elif cycleE and not cycleS:
			if eMonth >= temp_month and curr_year == temp_year:
				rev += inv['Balance_Due']
				temp_rev[idx]['revenue'] += inv['Balance_Due']
			elif sMonth <= temp_month and curr_year != temp_year:
				rev += inv['Balance_Due']
				temp_rev[idx]['revenue'] += inv['Balance_Due']
		elif cycleS and cycleE:
			if sMonth <= temp_month and curr_year != temp_year and eMonth >= temp_month:
				rev += inv['Balance_Due']
				temp_rev[idx]['revenue'] += inv['Balance_Due']

	res['totalRevenue'] = rev
	for r in temp_rev:
		rev_pat = {
			'client': r['client'],
			'revenue': r['revenue']
		}
		res['revenue'].append(rev_pat)

	return JsonResponse(res,safe=True)



def _get_expense_by_year(expenses):
	exps_y = [expenses[0]]
	exps = []
	curr_year = exps_y[0]['Date'].year
	flag = False
	for i in expenses:
		y = i['Date'].year
		exps.append(i)
		if y < curr_year:
			if flag :
				break
			exps_y.append(i)
			exps.append(i)
			curr_year = y
			flag = True
	return (len(exps_y),exps)


@csrf_exempt
@post('accessToken','token','startMonth','endMonth','quantity')
def report_expense(request):

	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	qty = request.POST['quantity']
	currMonth = date.today().month

	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	expense = Expense.objects.all().order_by('-Date').values()

	if expense is None or len( expense ) <= 0 :
		return HttpResponse('Expense not found',status=400)

	exps_y,exps = _get_expense_by_year(expense)
	curr_year = exps[0]['Date'].year
	if exps_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)

	res = {
		'expense':[],
		'totalExpense': 0
	}

	'''
	revPat = {
		'vendor':
		'expense':
	}
	'''
	temp_rev = []

	rev = 0
	for i in range( 0, len(exps)):
		if qty == 0:
			break
		qty -= 1

		exp = exps[i]
		temp_date = exp['Date']
		temp_month = temp_date.month
		temp_year = temp_date.year
		vendor = Vendor.objects.filter(Vendor_Id=exp['Vendor_Id_id']).values()
		if vendor is None or len(vendor) <= 0:
			return HttpResponse('Database is correpted', status=500)

		name = vendor[0]['Vendor_Name']

		rev_pat = {
			'vendor': name,
			'expense': 0,
			'id' : vendor[0]['Vendor_Id']
		}

		idx = -1
		for j in range( 0, len( temp_rev ) ):
			r = temp_rev[j]
			if r['id'] == rev_pat['id']:
				rev_pat = r
				idx = j
				break
		if idx == -1:
			temp_rev.append(rev_pat)
			idx = len( temp_rev ) - 1

		if not cycleE and not cycleS:
			if curr_year != temp_year :
				break
			if sMonth <= temp_month and eMonth >= temp_month:
				rev += exp['Amount']
				temp_rev[idx]['expense'] += exp['Amount']
		elif cycleE and not cycleS:
			if eMonth >= temp_month and curr_year == temp_year:
				rev += exp['Amount']
				temp_rev[idx]['expense'] += exp['Amount']
			elif sMonth <= temp_month and curr_year != temp_year:
				rev += exp['Amount']
				temp_rev[idx]['expense'] += exp['Amount']
		elif cycleS and cycleE:
			if sMonth <= temp_month and curr_year != temp_year and eMonth >= temp_month:
				rev += exp['Amount']
				temp_rev[idx]['expense'] += exp['Amount']

	res['totalExpense'] = rev
	for r in temp_rev:
		rev_pat = {
			'vendor': r['vendor'],
			'expense': r['expense']
		}
		res['expense'].append(rev_pat)

	return JsonResponse(res,safe=True)

@csrf_exempt
@post('accessToken','token','startMonth','endMonth','quantity')
def report_unbilled(request):
	rSMonth = request.POST['startMonth']
	rEMonth = request.POST['endMonth']
	currMonth = date.today().month
	qty = request.POST['quantity']
	
	cycleS = True if currMonth < rSMonth else False
	cycleE = True if currMonth < rEMonth else False
	sMonth = abs( currMonth - rSMonth )
	eMonth = abs( currMonth - rEMonth )

	invoices = Invoice.objects.all().order_by('-Date').values()
	if invoices is None or len( invoices ) <= 0 :
		return HttpResponse('Invoice not found',status=400)
	
	invs_y,invs = _get_invoices_by_year(invoices)
	curr_year = invs[0]['Date'].year
	
	if invs_y == 1 and cycleS and cycleE:
		return HttpResponse('Invalid Arguments',status=400)
	
	res = {
		'expense':[],
		'totalOverdue': 0
	}

	'''
	revPat = {
		'client':
		'due':
		'days':
	}
	'''

	check_limit = lambda d, limit: ( date.today() - d ).days > limit 
	get_limit = lambda d, limit: ( date.today() - d ).days - limit 
	totalOver = 0
	temp_rev = []
	for i in range( 0, len(invs)):
		if qty == 0:
			break
		qty -= 1

		inv = invs[i]
		temp_date = inv['Date']
		temp_month = temp_date.month
		temp_year = temp_date.year
		clients = Client.objects.filter(Client_Id=inv['Client_Id_id']).values()
	
		if clients is None or len(clients) <= 0:
			return HttpResponse('Database is correpted', status=500)

		client = clients[0]
		name = f"{client['Fname']} {client['Lname']}"
		totalOver += inv['Balance_Due']
		if not check_limit(temp_date, client['Day_Limit']):
			continue
		rev_pat = {
			'client': name,
			'due': 0,
			'days': get_limit(temp_date, client['Day_Limit']),
			'id' : client['Client_Id']
		}

		idx = -1
		for j in range( 0, len( temp_rev ) ):
			r = temp_rev[j]
			if r['id'] == rev_pat['id']:
				rev_pat = r
				idx = j
				break
		if idx == -1:
			temp_rev.append(rev_pat)
			idx = len( temp_rev ) - 1

		if not cycleE and not cycleS:
			if clients is None or len(clients) <= 0:
				break 
			if curr_year != inv['Date'].year :
				break

			if sMonth <= inv['Date'].month and eMonth >= inv['Date'].month:
				temp_rev[idx]['due'] += inv['Balance_Due']

		elif cycleE and not cycleS:

			if clients is None or len(clients) <= 0:
				break 

			if eMonth >= inv['Date'].month and curr_year == inv['Date'].year:
				temp_rev[idx]['due'] += inv['Balance_Due']
			elif sMonth <= inv['Date'].month and curr_year != inv['Date'].year:
				temp_rev[idx]['due'] += inv['Balance_Due']
		
		elif cycleS and cycleE:

			if clients is None or len(clients) <= 0:
				break 

			if sMonth <= inv['Date'].month and curr_year != inv['Date'].year and eMonth >= inv['Date'].month:
				temp_rev[idx]['due'] += inv['Balance_Due']
	
	res['totalOverdue'] = totalOver
	for r in temp_rev:
		rev_pat = {
			'client': r['client'],
			'due': r['due'],
			'days': r['days'],
		}
		res['expense'].append(rev_pat)

	return JsonResponse(res,safe=True) 
