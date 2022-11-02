const dotenv = require('dotenv')

let ENV_FILE_NAME = ''
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env.production'
    break
  case 'staging':
    ENV_FILE_NAME = '.env.staging'
    break
  case 'test':
    ENV_FILE_NAME = '.env.test'
    break
  case 'development':
  default:
    ENV_FILE_NAME = '.env'
    break
}

try {
  dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME })
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001'

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000'

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://localhost/medusa-store'

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

//gcp storage
const GCP_BUCKET = process.env.GCP_BUCKET || 'bucket'
const GCP_EMAIL = process.env.GCP_EMAIL || 'myemail@example.com'
const GCP_PRIVATE_KEY = process.env.GCP_PRIVATE_KEY || 'myemail@example.com'

//JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret'
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie-secret'

//algolia search
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'algolia_app_id'
const ALGOLIA_ADMIN_API_KEY =
  process.env.ALGOLIA_ADMIN_API_KEY || 'algolia_admin_key'

//slack notification
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
const ADMIN_ORDER_URL =
  process.env.ADMIN_ORDER_URL || 'http://localhost:7001/a/orders'

//sendgrid email
/*
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'sendgrid_api_key'
const SENDGRID_FROM = process.env.SENDGRID_FROM || 'sendgrid@sendgrid.net'
const SENDGRID_ORDER_PLACED = process.env.SENDGRID_ORDER_PLACED || 'order.placed'
const SENDGRID_ORDER_CANCELED = process.env.SENDGRID_ORDER_CANCELED || 'order_canceled_template'
const SENDGRID_ORDER_SHIPPED = process.env.SENDGRID_ORDER_SHIPPED || 'order_shipped_template'
const SENDGRID_RETURN_REQUESTED = process.env.SENDGRID_RETURN_REQUESTED || 'order_return_requested_template'
const SENDGRID_CLAIM_SHIPMENT_CREATED = process.env.SENDGRID_CLAIM_SHIPMENT_CREATED || 'claim_shipment_created_template'
const SENDGRID_SWAP_CREATED = process.env.SENDGRID_SWAP_CREATED || 'swap_created_template'
const SENDGRID_SWAP_SHIPMENT_CREATED = process.env.SENDGRID_SWAP_SHIPMENT_CREATED || 'swap_shipment_created_template'
const SENDGRID_SWAP_RECEIVED = process.env.SENDGRID_SWAP_RECEIVED || 'swap_received_template'
const SENDGRID_GIFT_CARD_CREATED = process.env.SENDGRID_GIFT_CARD_CREATED || 'gift_card_created_template'
const SENDGRID_CUSTOMER_PASSWORD_RESET = process.env.SENDGRID_CUSTOMER_PASSWORD_RESET || 'customer_password_reset_template'
const SENDGRID_MEDUSA_RESTOCK = process.env.SENDGRID_MEDUSA_RESTOCK || 'medusa_restock_template'
*/

//smtp email config
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com'
const SMTP_PORT = process.env.SMTP_PORT || 587
const SMTP_USER = process.env.SMTP_USER || 'user'
const SMTP_PASS = process.env.SMTP_PASS || 'pass'
const SMTP_MAIL_FROM = process.env.SMTP_MAIL_FROM || 'noreply@medusajs.com'
const secureConnection = SMTP_PORT === 587
// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-plugin-smtp`,
    options: {
      fromEmail: SMTP_MAIL_FROM,
      // this object is input directly into nodemailer.createtransport(), so anything that works there should work here
      // see: https://nodemailer.com/smtp/#1-single-connection and https://nodemailer.com/transports/
      transport: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secureConnection: secureConnection,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        tls: {
          ciphers: 'SSLv3',
        },
        requireTLS: true,
      },
      //this is the path where your email templates are stored
      emailTemplatePath: 'data/templates/emails',
      // this maps the folder/template name to a medusajs event to use the right template
      // only the events that are registered here are subscribed to
      templateMap: {
        // "eventname": "templatename",
        'order.placed': 'order.placed',
        'order.canceled': 'order_canceled_template',
        'order.shipment_created': 'order_shipped_template',
        'order.return_requested': 'order_return_requested_template',
        'order.items_returned': 'order_returned_template',
        'claim.shipment_created': 'claim_shipment_created_template',
        'swap.created': 'swap_created_template',
        'swap.shipment_created': 'swap_shipment_created_template',
        'order.gift_card_created': 'gift_card_created_template',
        'gift_card.created': 'gift_card_created_template',
        'customer.password_reset': 'customer_password_reset_template',
        'user.password_reset': 'customer_password_reset_template',
        'invite.created': 'invite_created_template',
        'restock-notification.restocked': 'medusa_restock_template',
      },
    },
  },
  /*
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: SENDGRID_API_KEY,
      from: SENDGRID_FROM,
      order_placed_template: SENDGRID_ORDER_PLACED,
      order_canceled_template: SENDGRID_ORDER_CANCELED,
      order_shipped_template: SENDGRID_ORDER_SHIPPED,
      order_return_requested_template: SENDGRID_RETURN_REQUESTED,
      claim_shipment_created_template: SENDGRID_CLAIM_SHIPMENT_CREATED,
      swap_created_template: SENDGRID_SWAP_CREATED,
      swap_shipment_created_template: SENDGRID_SWAP_SHIPMENT_CREATED,
      swap_received_template: SENDGRID_SWAP_RECEIVED,
      gift_card_created_template: SENDGRID_GIFT_CARD_CREATED,
      customer_password_reset_template: SENDGRID_CUSTOMER_PASSWORD_RESET,
      medusa_restock_template: SENDGRID_MEDUSA_RESTOCK
    }
  },
  */
  // Uncomment to add Stripe support.
  // You can create a Stripe account via: https://stripe.com
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: `medusa-plugin-gcp`,
    options: {
      bucket: GCP_BUCKET,
      credentials: {
        private_key: GCP_PRIVATE_KEY,
        client_email: GCP_EMAIL,
      },
    },
  },
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      application_id: ALGOLIA_APP_ID,
      admin_api_key: ALGOLIA_ADMIN_API_KEY,
      settings: {
        products: {
          searchableAttributes: ['title', 'description'],
          attributesToRetrieve: [
            'id',
            'title',
            'description',
            'handle',
            'thumbnail',
            'variants',
            'variant_sku',
            'options',
            'collection_title',
            'collection_handle',
            'images',
          ],
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-slack-notification`,
    options: {
      show_discount_code: false,
      slack_url: SLACK_WEBHOOK_URL,
      admin_orders_url: ADMIN_ORDER_URL,
    },
  },
]

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: 'postgres',
    //database_database: "./medusa-db.sql",
    //database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    jwt_secret: JWT_SECRET,
    cookie_secret: COOKIE_SECRET,
  },
  plugins,
}
