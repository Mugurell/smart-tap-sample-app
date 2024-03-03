const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// TODO: Define issuer ID
let issuerId = 'add your own';
let classSuffix = 'public_test';
let objectSuffix = 'test01';
const objectId = `${issuerId}.${objectSuffix}`;
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/path/to/key.json';

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

const credentials = require(keyFilePath);

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
});

// Create a Generic pass object
let genericObject = {
  'id': `${objectId}`,
  'classId': `${issuerId}.${classSuffix}`,
  'smartTapRedemptionValue': 'Decrypted super secret payload, courtesy of Petru',
  'genericType': 'genericTypeUnspecified',
  'hasUsers': true,
  'state': 'active',
  'logo': {
    'sourceUri': {
      'uri': 'https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/ab-testing-mobile-icon.png',
    },
    'contentDescription': {
      'defaultValue': {
        'language': 'en-US',
        'value': 'LOGO_IMAGE_DESCRIPTION',
      },
    },
  },
  'cardTitle': {
    'defaultValue': {
      'language': 'en-US',
      'value': 'Testing testing',
    },
  },
  'subheader': {
    'defaultValue': {
      'language': 'en-US',
      'value': 'Junior Architect',
    },
  },
  'header': {
    'defaultValue': {
      'language': 'en-US',
      'value': 'Gigi Popescu',
    },
  },
  'textModulesData': [
    {
      'id': 'team',
      'header': 'Team',
      'body': 'Greatest',
    },
    {
      'id': 'role',
      'header': 'Roles',
      'body': 'Everything, everywhere, all at once',
    },
    {
      'id': 'anything_else',
      'header': 'Anything else',
      'body': 'Any other interesting/important info',
    },
  ],
  'barcode': {
    'type': 'QR_CODE',
    'value': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'alternateText': 'QR Backup ^^',
  },
  'hexBackgroundColor': '#374c8b',
  'heroImage': {
    'sourceUri': {
      'uri': 'https://c8.alamy.com/comp/P7FFHR/command-young-office-workers-on-the-background-of-a-multi-storey-glass-building-five-managers-teamwork-office-a-group-of-people-exchange-traders-P7FFHR.jpg',
    },
    'contentDescription': {
      'defaultValue': {
        'language': 'en-US',
        'value': 'HERO_IMAGE_DESCRIPTION',
      },
    },
  },
}

const claims = {
  iss: credentials.client_email, // `client_email` in service account file.
  aud: 'google',
  origins: ['http://localhost:3000'],
  typ: 'savetowallet',
  payload: {
    genericObjects: [genericObject],
  },
};

const token = jwt.sign(claims, credentials.private_key, {algorithm: 'RS256'});
console.log(token)