const { GoogleAuth } = require('google-auth-library');

// TODO: Define issuer ID
let issuerId = 'add your own';
let classSuffix = 'public_test';
const classId = `${issuerId}.${classSuffix}`;
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/path/to/key.json';

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentials = require(keyFilePath);

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

// Create a Generic pass class
let genericClass = {
 'id': `${classId}`,
 'redemptionIssuers': [`${issuerId}`],
 'enableSmartTap': true,
 'classTemplateInfo': {
   'cardTemplateOverride': {
     'cardRowTemplateInfos': [
       {
         'twoItems': {
           'startItem': {
             'firstValue': {
               'fields': [
                 {
                   'fieldPath': 'object.textModulesData["team"]',
                 },
               ],
             },
           },
           'endItem': {
             'firstValue': {
               'fields': [
                 {
                   'fieldPath': 'object.textModulesData["role"]',
                 },
               ],
             },
           },
         },
       },
     ],
   },
 },
}

// Check if the class exists already
httpClient.request({
  url: `${baseUrl}/genericClass/${classId}`,
  method: 'GET',
}).then(response => {
  console.log('Class already exists');
  console.log(response);

  console.log('Class ID');
  console.log(response.data.id);
}).catch(err => {
  if (err.response && err.response.status === 404) {
    // Class does not exist
    // Create it now
    httpClient.request({
      url: `${baseUrl}/genericClass`,
      method: 'POST',
      data: genericClass,
    }).then(response => {
      console.log('Class insert response');
      console.log(response);

      console.log('Class ID');
      console.log(response.data.id);
    });
  } else {
    // Something else went wrong
    console.log(err);
  }
});
