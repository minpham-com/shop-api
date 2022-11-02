const dotenv = require("dotenv");
const getPrivateKey = require('./helper')
let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

const isString = (v) => typeof v === 'string' || v instanceof String

const base64Decode = (v) => {
  try {
    const buff = Buffer.from(v, 'base64');
    return buff.toString('ascii');
  }catch(e){
    console.log('base64Decode error', e)
    return v
  }
}

const getPrivateKey = (v) => {
  v = decodeURIComponent(v);
  if( isString(v) && isBase64(v)) {
    v = base64Decode(v)
  }
  return JSON.parse(v)
  //return JSON.stringify(v.split(String.raw`\n`).join('\n'))
  //return JSON.stringify(v)
}
// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000'

const DATABASE_TYPE = process.env.DATABASE_TYPE || "sqlite";
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-store";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const DATABASE_EXTRA = process.env.DATABASE_SOCKET_PATH ? {
  socketPath: process.env.DATABASE_SOCKET_PATH
} : {}

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-plugin-smtp`,
    options: {
      fromEmail: process.env.SMTP_MAIL_FROM || 'noreply@medusajs.com',
      // this object is input directly into nodemailer.createtransport(), so anything that works there should work here
      // see: https://nodemailer.com/smtp/#1-single-connection and https://nodemailer.com/transports/
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: process.env.SMTP_PORT || 587,
        secureConnection: (process.env.SMTP_PORT || 587) === 587 ? true : false,
        auth: {
          user: process.env.SMTP_USER || 'user',
          pass: process.env.SMTP_PASS || 'pass',
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
    }
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY || '',
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX || true,
      client_id: process.env.PAYPAL_CLIENT_ID || '',
      client_secret: process.env.PAYPAL_CLIENT_SECRET || '',
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID || '',
    },
  },
  {
    resolve: `medusa-plugin-gcp`,
    options: {
      bucket: process.env.GCP_BUCKET || 'bucket',
      credentials: getPrivateKey(process.env.GCP_PRIVATE_KEY || 'myemail@example.com'),
    },
  },
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      applicationId: process.env.ALGOLIA_APP_ID || 'algolia_app_id',
      adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY || 'algolia_admin_key',
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description"],
            attributesToRetrieve: [
              "id",
              "title",
              "description",
              "handle",
              "thumbnail",
              "variants",
              "variant_sku",
              "options",
              "collection_title",
              "collection_handle",
              "images",
            ],
          },
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-slack-notification`,
    options: {
      show_discount_code: false,
      slack_url: process.env.SLACK_WEBHOOK_URL || '',
      admin_orders_url: process.env.ADMIN_ORDER_URL || 'http://localhost:7001/a/orders',
    },
  },
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  // {
  //   resolve: "@medusajs/admin",
  //   /** @type {import('@medusajs/admin').PluginOptions} */
  //   options: {
  //     autoRebuild: true,
  //   },
  // },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
}

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database_database: "./medusa-db.sql",
  database_type: DATABASE_TYPE,
  database_extra: DATABASE_EXTRA || {},
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
}

if (DATABASE_URL && DATABASE_TYPE === "postgres") {
  projectConfig.database_url = DATABASE_URL;
  delete projectConfig["database_database"];
}


/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
	modules,
};
