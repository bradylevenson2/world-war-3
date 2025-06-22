# Square Payment Integration - Required Credentials

## 🔑 Square Developer Dashboard Setup

### 1. Go to Square Developer Dashboard
Visit: https://developer.squareup.com/

### 2. Create/Select Your Application
- Sign in with your Square account
- Create a new application or select existing one
- Name it "World War 3 Update" or similar

### 3. Get Required Credentials

From your Square Dashboard, you need these **4 credentials**:

#### **Application ID** 
- Found in: Dashboard > Your App > Credentials
- Starts with: `sq0idp-` or `sandbox-sq0idb-`
- Add to `.env` as: `VITE_SQUARE_APPLICATION_ID=sq0idp-xxxxx`

#### **Access Token**
- Found in: Dashboard > Your App > Credentials  
- Production: Starts with `EAAAl` or `EAAAE`
- Sandbox: Starts with `EAAAl` (different from prod)
- Add to `.env` as: `VITE_SQUARE_ACCESS_TOKEN=EAAAl-xxxxx`

#### **Location ID**
- Found in: Dashboard > Your App > Locations
- Usually starts with: `L` followed by letters/numbers
- Add to `.env` as: `VITE_SQUARE_LOCATION_ID=L123ABC456DEF`

#### **Environment**
- Set to `sandbox` for testing
- Set to `production` for live payments
- Add to `.env` as: `VITE_SQUARE_ENVIRONMENT=sandbox`

### 4. Enable Required Features
In your Square Dashboard:
- ✅ Enable "Payments API"
- ✅ Enable "Web Payments SDK"
- ✅ Add your domain to allowed origins

### 5. Example .env Configuration
```bash
# Square Configuration (FILL IN YOUR ACTUAL VALUES)
VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-your-app-id-here
VITE_SQUARE_ACCESS_TOKEN=EAAAl-your-access-token-here  
VITE_SQUARE_LOCATION_ID=L123ABC456DEF
VITE_SQUARE_ENVIRONMENT=sandbox
```

## ⚠️ Important Notes:
- Use **sandbox** credentials for testing
- Switch to **production** credentials when going live
- Keep these credentials secure and never commit to git
- The frontend only needs Application ID and Location ID
- Access Token should be used in backend only (for security)

## 🚀 Next Steps:
1. Get these 4 credentials from Square Dashboard
2. Add them to your `.env` file
3. Test payments work in sandbox mode
4. Create backend endpoint to process payments
5. Switch to production when ready to go live
