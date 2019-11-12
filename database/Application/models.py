from django.db import models

#Utility Database:
#---------------------------------------------------------
class Country(models.Model):
	Id=models.AutoField(primary_key=True)
	Country_Code=models.CharField(max_length=5)
	Country_Name=models.TextField()
	

class Currency(models.Model):
	Id=models.AutoField(primary_key=True)
	Code=models.CharField(max_length=10)
	Name=models.CharField(max_length=50)
	Symbol=models.CharField(max_length=10)
	

#In mysql client use 'alter table application_phonecode AUTO_INCREMENT=1;' to have starting value as 1
class PhoneCode(models.Model):
	Id=models.AutoField(primary_key=True)
	Country_Name=models.TextField()
	ISO_Code=models.CharField(max_length=10)
	ISD_Code=models.CharField(max_length=10)

#---------------------------------------------------------
class Company(models.Model):
	Company_Id=models.AutoField(primary_key=True)
	Company_Name=models.CharField(max_length=50)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	#The Pin_Code field is added after creation of table thus need to set a default value
	Pin_Code=models.PositiveIntegerField()
	Country_Code=models.CharField(max_length=5)
	Country_Name=models.TextField()
	State=models.CharField(max_length=30)
	Email=models.EmailField()
	Phone=models.PositiveIntegerField()
	Tax_Rate=models.FloatField()
	Base_Currency=models.ForeignKey(Currency,on_delete=models.CASCADE,default="")
	Date_Format=models.CharField(max_length=10)

	def __str__(self):
		return (str(self.Company_Id)+','+self.Company_Name+', ('+self.Address_Line+','+self.City+','+
			   self.State+') ,'+self.Email+','+str(self.Phone)+','+','+str(self.Tax_Rate) )

class User(models.Model):
	User_Id=models.AutoField(primary_key=True)
	Fname=models.CharField(max_length=50)
	Lname=models.CharField(max_length=50)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	#The Pin_Code field is added after creation of table thus need to set a default value
	Pin_Code=models.IntegerField()
	State=models.CharField(max_length=30)
	Country_Name=models.TextField()
	Country_Code=models.CharField(max_length=5)
	Email=models.EmailField()
	#The Password field is added after creation of table thus need to set a default value
	Password=models.CharField(max_length=100,default="")
	Phone=models.IntegerField()
	Auth_Level=models.PositiveIntegerField()
	Comp_Id = models.ForeignKey(Company, on_delete=models.DO_NOTHING)

	def __str__(self):
		return f"{self.User_Id}, {self.Fname}, {self.Lname}, ( {self.Address_Line}, {self.City}, {self.State}), {self.Email}, {self.Phone}, {self.Auth_Level}"

#------------------------------------------------------------------------------------------------------

class Category(models.Model):
	Category_Id = models.AutoField(primary_key=True)
	Type = models.TextField()

class Client(models.Model):
	Client_Id=models.AutoField(max_length=20,primary_key=True)
	Fname=models.CharField(max_length=50)
	Lname=models.CharField(max_length=50)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	Pin_Code=models.PositiveIntegerField()
	State=models.CharField(max_length=30)
	Country_Name=models.TextField()
	Country_Code=models.CharField(max_length=5)
	Day_Limit=models.PositiveSmallIntegerField()
	#The Late_Fee_Rate field is added after creation of table thus need to set a default value
	Late_Fee_Rate=models.FloatField(default=0)
	Email=models.EmailField()
	Phone=models.PositiveIntegerField()

	def __str__(self):
		return f"{self.Client_Id}, {self.Fname}, {self.Lname}, {self.Address_Line}, {self.City}, {self.State},{self.Pin_Code}, {self.Email}, {self.Phone}, {self.Late_Fee_Rate}"

class Vendor(models.Model):
	Vendor_Id=models.AutoField(max_length=20,primary_key=True)
	Vendor_Name=models.CharField(max_length=100)
	Vendor_Category=models.CharField(max_length=10)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	Pin_Code=models.PositiveIntegerField()
	Country_Name=models.TextField()
	Country_Code=models.CharField(max_length=5)
	State=models.CharField(max_length=30)
	Country_Code=models.CharField(max_length=10)
	Country=models.CharField(max_length=6)
	Email=models.EmailField()
	Phone=models.PositiveIntegerField()

	def __str__(self):
		return(str(self.Vendor_Id)+','+self.Vendor_Name+','+self.Vendor_Category+','+self.Address_Line+','+
			   self.City+','+self.State+','+ str(self.Pin_Code) +','+self.Email+','+ str(self.Phone) ) 

class Expense(models.Model):
	Expense_Id=models.AutoField(primary_key=True)
	Category_Id=models.ForeignKey(Category,on_delete=models.DO_NOTHING)
	Date=models.DateField()
	Vendor_Id=models.ForeignKey(Vendor,on_delete=models.DO_NOTHING)
	Description=models.TextField()
	Amount=models.FloatField()

class Account(models.Model):
	Account_Id=models.AutoField(primary_key=True)
	Tax=models.FloatField()
	Tax_type=models.CharField(max_length=20)
	Currency=models.CharField(max_length=5)
	Late_Fees=models.FloatField()
	Due_Date=models.DateField()
	Due_Amount=models.FloatField()

	def __str__(self):
		return(self.Account_Id+','+self.Currency+','+str(self.Tax)+','+self.Tax_type+','+str(self.Late_Fees)+','+str(self.Due_Amount)+','+
			   str(self.Due_Date))

class Vendor_Account(models.Model):
    Vendor_Id=models.ForeignKey(Vendor, on_delete=models.DO_NOTHING)
    Account_Id=models.ForeignKey(Account,on_delete=models.DO_NOTHING)

class Client_Account(models.Model):
    Client_Id=models.ForeignKey(Client, on_delete=models.DO_NOTHING)
    Account_Id=models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    
class Transactions(models.Model):
    Account_Id=models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    Transaction_Id=models.AutoField(primary_key=True)
    Transaction_Date=models.DateField()
    Transaction_amt=models.FloatField()

    def __str__(self):
    	return (str(self.Transaction_Id)+','+str(self.Transaction_amt)+','+str(self.Transaction_Date))
		
class Quotes(models.Model):
    Id=models.AutoField(primary_key=True)
    AFName=models.CharField(max_length=20)
    ALName=models.CharField(max_length=20)
    Quote=models.TextField()

    def __str__(self):
        return ( str(self.Id)+','+self.AFName+','+self.ALName+','+self.Quote)

class Invoice(models.Model):
	Invoice_Id = models.AutoField(primary_key=True)
	Client_Id = models.ForeignKey(Client, on_delete=models.DO_NOTHING)
	Date = models.DateField()
	Amount_Due = models.FloatField()
	Amount_Paid = models.FloatField()
	Total = models.FloatField()
	Balance_Due = models.FloatField()
	Notes = models.TextField()
	Date_Fomat = models.CharField(max_length=10)

	def __str__(self):
		return f"{self.Invoice_Id}, {self.Date}, {self.Amount_Due}, {self.Amount_Paid}, {self.Total}, {self.Balance_Due}, ( {self.Notes} )"

class Item(models.Model):
	Item_Id = models.AutoField(primary_key=True)
	Name = models.TextField()
	Description = models.TextField()
	Rate = models.FloatField()
	Invoice_Id = models.ForeignKey(Invoice,on_delete=models.DO_NOTHING)

class Item_Invoice(models.Model):
	Item_Id = models.ForeignKey(Item, on_delete=models.DO_NOTHING)
	Invoice_Id = models.ForeignKey(Invoice, on_delete=models.DO_NOTHING)
	Quantity = models.IntegerField(default=1)
	Price = models.IntegerField()

	def __str__(self):
		return f"{self.Item_Id}, ( {self.Name} ), ( {self.Description} ), {self.Rate}, {self.Quantity}, {self.Price}"
