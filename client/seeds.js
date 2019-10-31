const data = {
  countryCode : ['+91', '+88', '+65'],
  //VENDOR
  pseudoVendor: {
    name: 'SecretShop',
    countryCode: '+65',
    phone: '2975107492',
    email: 'carl@hunter.gg',
    address1: 'Monterey Bay Aquarium, 886 Cannery Row',
    city: 'Monterey',
    state: 'California',
    country: 'USA',
    pincode: '93940',
  },
  //CLIENT
  pseudoClient:{
    firstName: 'Leviathan',
    lastName: 'Tidehunter',
    countryCode: '+65',
    phone: '2975107492',
    email: 'leviathan@hunter.gg',
    address1: 'Monterey Bay Aquarium, 886 Cannery Row',
    city: 'Monterey',
    state: 'California',
    country: 'USA',
    pincode: '93940',
    lateFeeRate: '3.15'
  },
  //EXPENSE

  pseudoExpense : {
      category: 'Education',
      date: '2018-01-22',
      vendor: 'TCS',
      description: 'financing education',
      subtotal: 22.4
  },
  vendors : [
      'ABC',
      'KFC',
      'BMW',
      'TCS',
      'IBM',
      'HP',
      'HDFC',
      'SBI',
      'ICICI'
  ],
  categories : [
     'Education', 'Food', 'Advertising'
 ],

 //COMPANY
 psuedoAccountant : {
     accountantType: 'Head',
     firstName: 'Leviathan',
     lastName: 'Tidehunter',
     countryCode: '+65',
     phone: '2975107492',
     email: 'leviathan@hunter.gg',
     address1: 'Monterey Bay Aquarium, 886 Cannery Row',
     city: 'Monterey',
     state: 'California',
     country: 'USA',
     pincode: '93940',
 },
 currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
 dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd'],
 pseudoCompany : {
     name: 'Pineapple',
     countryCode: '+88',
     phone: '8528606977',
     email: 'contact@pineapple.co',
     address1: '196 Temple Drive',
     city: 'Dublin',
     state: 'RI',
     country: 'Ireland',
     pincode: '226013',
     currency: '£ (GBP)',
     datefmt: 'mm/dd/yyyy',
     taxrate: '3.14'
 },
 //INVOICE
 categories : [
     'Education', 'Food', 'Advertising'
 ],

 //REPORT
 pseudoItem :  {
   clientName: 'Ashlia',
   invoiceID: '00001',
   invoiceDate: '10/28/2019',
   unitCost: '$250000.00',
   quantity: '1',
   discount: '0%',
   total: '$250000.00',
   itemType: 'IT Consulting',
   tax: '0.00',
   paid: '$100000.00',
   paidDate: '10/29/2019',
   due: '$150000.00',
   description: '',
 },
 pseudoExpenseR : {
   vendorName: 'Aslia',
   description: 'Educating new interns',
   date: '10/28/2019',
   amount: '$250000.00',
   quantity: '1',
   discount: '0%',
   expenseType: 'Education',
   tax: '0.00',
   total: '$250000.00',
 },

 pseudoProfitLoss : {
   sales: '$25000.00',
   cost: '$0.00',
   expenseType: 'Education',
   expenseTotal: '$20000.00',
   profit: '$5000.00',
 },

}

module.exports = data;

// countryCode = ['+91', '+88', '+65'];
//
// //VENDOR
//
// const pseudoVendor = {
//     name: 'SecretShop',
//     countryCode: '+65',
//     phone: '2975107492',
//     email: 'carl@hunter.gg',
//     address1: 'Monterey Bay Aquarium, 886 Cannery Row',
//     city: 'Monterey',
//     state: 'California',
//     country: 'USA',
//     pincode: '93940',
// };
//
// //CLIENT
//
// const pseudoClient = {
//     firstName: 'Leviathan',
//     lastName: 'Tidehunter',
//     countryCode: '+65',
//     phone: '2975107492',
//     email: 'leviathan@hunter.gg',
//     address1: 'Monterey Bay Aquarium, 886 Cannery Row',
//     city: 'Monterey',
//     state: 'California',
//     country: 'USA',
//     pincode: '93940',
//     lateFeeRate: '3.15'
// };
//
//
// //EXPENSE
//
// const pseudoExpense = {
//     category: 'Education',
//     date: '2018-01-22',
//     vendor: 'TCS',
//     description: 'financing education',
//     subtotal: 22.4
// };
//
// const vendors = [
//     'ABC',
//     'KFC',
//     'BMW',
//     'TCS',
//     'IBM',
//     'HP',
//     'HDFC',
//     'SBI',
//     'ICICI'
// ];
//
// const categories = [
//     'Education', 'Food', 'Advertising'
// ];
//
// //INVOICE
//
// //REPORT
//
//
// //COMPANY
//
// const psuedoAccountant = {
//     accountantType: 'Head',
//     firstName: 'Leviathan',
//     lastName: 'Tidehunter',
//     countryCode: '+65',
//     phone: '2975107492',
//     email: 'leviathan@hunter.gg',
//     address1: 'Monterey Bay Aquarium, 886 Cannery Row',
//     city: 'Monterey',
//     state: 'California',
//     country: 'USA',
//     pincode: '93940',
// };
