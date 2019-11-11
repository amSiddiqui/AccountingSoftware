const data = {
  countryCode : ['+91', '+88', '+65'],
  //VENDOR
  pseudoVendor: [
    {
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
  ],
  //CLIENT
  pseudoClient:[
    {
      id: 1,
      firstName: 'Leviathan1',
      lastName: 'Tidehunter',
      countryCode: '+65',
      phone: '2975107492',
      email: 'leviathan@hunter.gg',
      address: {
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
      },
      lateFeeRate: '3.15',
      amountDue: 200,
      total:270,
      currency: '£ (GBP)',

    },
    {
      id: 2,
      firstName: 'Leviathan2',
      lastName: 'Tidehunter',
      countryCode: '+65',
      phone: '2975107492',
      email: 'leviathan@hunter.gg',
      address: {
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
      },
      lateFeeRate: '3.15',
      amountDue: 200,
      total:270,
      currency: '£ (GBP)',
    },
    {
      id: 3,
      firstName: 'Leviathan3',
      lastName: 'Tidehunter',
      countryCode: '+65',
      phone: '2975107492',
      email: 'leviathan@hunter.gg',
      address: {
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
      },
      lateFeeRate: '3.15',
      amountDue: 200,
      total:270,
      currency: '£ (GBP)',
    },

  ],
  //EXPENSE

  pseudoExpense: [
    {
        id: 1,
        countryCode: '+91',
        category: 'Education',
        date: '01/22/2018',
        vendor: 'TCS',
        phone: '7823651098',
        description: 'financing education',
        subtotal: 22400,
    },
  ],
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
 psuedoAccountant : [

   {
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
 ],
 currency: ['$ (USD)', '€ (EUR)', '£ (GBP)', '₹ (INR)'],
 dateFormat: ['dd/mm/yyy', 'mm/dd/yyyy', 'yyyy/mm/dd'],
 pseudoCompany : [
   {
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
 ],
 //INVOICE

  invoiceGenData : {
    totalOutstanding: 20000,
    totalInDraft: 2500,
    totalOverdue: 2000,
  },

  invoices: [{
    client: {
      id:1,
      firstName: 'Leviathan1',
      lastName: 'Tidehunter',
      countryCode: '+65',
      phone: '2975107492',
      email: 'leviathan@hunter.gg',
      address: {
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
      },
      lateFeeRate: '3.15'
    },
    id: 1,
    date: '22/11/2019',
    amountDue: 200,
    items: [
      {
        item: 'toothbrush',
        description: 'used for cleaning teeth',
        rate: 50,
        quantity: 3,
        price: 150
      },
      {
        item: 'toothpaste',
        description: 'used for cleaning teeth',
        rate: 60,
        quantity: 2,
        price: 120
      }
    ],
    total: 270,
    amountPaid: 50,
    balanceDue: 220,
    notes: 'shopping done on 22nd of november'
  },

  {
    client: {
      id:1,
      firstName: 'Leviathan1',
      lastName: 'Tidehunter',
      countryCode: '+65',
      phone: '2975107492',
      email: 'leviathan@hunter.gg',
      address: {
        address1: 'Monterey Bay Aquarium, 886 Cannery Row',
        city: 'Monterey',
        state: 'California',
        country: 'USA',
        pincode: '93940',
      },
      lateFeeRate: '3.15'
    },
    id: 2,
    date: '21/10/2019',
    amountDue: 100,
    items: [
      {
        item: 'toothbrush',
        description: 'used for cleaning teeth',
        rate: 50,
        quantity: 3,
        price: 150
      },
      {
        item: 'toothpaste',
        description: 'used for cleaning teeth',
        rate: 60,
        quantity: 2,
        price: 120
      }
    ],
    total: 270,
    amountPaid: 50,
    balanceDue: 220,
    notes: 'shopping done on 22nd of november'
  }],

 //REPORT
 pseudoItem :  [

   {
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
 ],
 pseudoExpenseR : [

   {
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
 ],

 pseudoProfitLoss : [
   {
     sales: '$25000.00',
     cost: '$0.00',
     expenseType: 'Education',
     expenseTotal: '$20000.00',
     profit: '$5000.00',
   },
 ],

 pseudoUser: {
   name: "L. Tidehunter",
   email: "contact@tide.dd",
   company :
    {
      name: 'Pineapple',
      countryCode: '+88',
      phone: '8528606977',
      email: 'contact@pineapple.co',
      address: {
        address1: '196 Temple Drive',
        city: 'Dublin',
        state: 'RI',
        country: 'Ireland',
        pincode: '226013',
      },
      currency: '£ (GBP)',
      datefmt: 'mm/dd/yyyy',
      taxrate: '3.14'
    },
    token: 'atoken'
 },
};

module.exports = data;
