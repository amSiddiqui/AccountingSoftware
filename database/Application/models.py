from django.db import models

class Company(models.Model):
	Company_Id=models.AutoField(primary_key=True)
	Company_Name=models.CharField(max_length=50)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	State=models.CharField(max_length=30)
	Email=models.EmailField()
	Phone=models.PositiveSmallIntegerField()
	Date=models.DateField()
	Tax_Rate=models.FloatField()
	#Base_Currency=models.CharField(max_length=10)

	def __str__(self):
		return (self.Company_Id+','+self.Company_Name+', ('+self.Address_Line+','+self.City+','+
			   self.State+') ,'+self.Email+','+self.Phone+','+self.Date+','+self.Tax_Rate)

class User(models.Model):
	User_Id=models.AutoField(primary_key=True)
	Fname=models.CharField(max_length=50)
	Lname=models.CharField(max_length=50)
	Address_Line=models.TextField()
	City=models.CharField(max_length=30)
	State=models.CharField(max_length=30)
	Email=models.EmailField()
	Phone=models.PositiveSmallIntegerField()
	Auth_Level=models.PositiveSmallIntegerField()
	Comp_Id = models.ForeignKey(Company, on_delete=models.CASCADE)

	def __str__(self):
		return (self.User_Id+','+self.Fname+','+self.Lname+', ('+self.Address_Line+','+self.City+','+
			   self.State+') ,'+self.Email+','+self.Phone+','+self.Auth_Level)


class Country(models.Model):
	Id=models.AutoField(primary_key=True)
	Country_Code=models.CharField(max_length=10)
	Country_Name=models.CharField(max_length=50)

class Currency(models.Model):
	Id=models.AutoField(primary_key=True)
	Code=models.CharField(max_length=10)
	Name=models.CharField(max_length=50)

#In mysql client use 'alter table application_phonecode AUTO_INCREMENT=1;' to have starting value as 1
class PhoneCode(models.Model):
	Id=models.AutoField(primary_key=True)
	Country_Name=models.CharField(max_length=50)
	ISO_Code=models.CharField(max_length=10)
	ISD_Code=models.CharField(max_length=10)