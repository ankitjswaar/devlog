const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_REDIRECT_URI',
  'CLIENT_URL',
];

export const getMongoUri = () =>
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.MONGO_URL ||
  null;

export const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => {
    if (key === 'MONGODB_URI') return !getMongoUri();
    return !process.env[key]?.trim();
  });

  if (missing.length > 0) {
    console.error('\n❌ Missing environment variables on server:\n');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n📌 Railway fix: Project → your service → Variables → add each variable.');
    console.error('   Copy values from your local server/.env file.\n');
    console.error('   For MongoDB you can use variable name MONGODB_URI or DATABASE_URL.\n');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
};
