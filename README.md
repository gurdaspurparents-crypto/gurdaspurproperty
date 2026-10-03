# Gurdaspur Property (`gurdaspurproperty.in`)

Official Real Estate & Property Advisory Portal for Gurdaspur, Punjab.

---

## 🚀 Features Built:
1. **Local Gurdaspur Focus**:
   - Filter by localities: Tibri Road, Jail Road, Trimmu Road, Hardochhani Road, Dinanagar Bypass, Hanuman Chowk, Sadar Bazar, Batala Road, etc.
   - Punjab Land Measurement units: Marla, Kanal, Gaj (Sq. Yards), Sq. Feet, Acre.
2. **Interactive Property Search**:
   - Buy, Rent, Plots, Kothis, Commercial SCOs, Agricultural Land.
   - Budget filtering & keyword search.
3. **Punjab Land Unit Calculator**:
   - Live interactive converter between Marla <-> Kanal <-> Gaj <-> Sq. Ft <-> Acre.
   - Supports both Colony standard (225 sq ft/Marla) and Revenue/Patwari standard (272.25 sq ft/Marla).
4. **Direct WhatsApp & Phone Inquiries**:
   - Pre-filled WhatsApp messages with Property ID and title.
   - 1-click customer callbacks.
5. **Free "Post Your Property" Form**:
   - Direct lead capture for sellers and landlords.
6. **Consultant Services & Advisory**:
   - Registry & Tehsil documentation, Inteqaal (Mutation), NRI Property care, Home loan support.
7. **Protected Admin Portal**:
   - Access via header/footer or top lock icon.
   - Default PIN: `1234`
   - Add, Edit, Delete properties, toggle status (Available, Token Paid, Sold).
   - View customer seller leads and inquiry history with direct Call & WhatsApp buttons.
   - Update WhatsApp number and office address.

---

## 🌐 Connecting `gurdaspurproperty.in` on Vercel:

1. Push this folder to GitHub or run:
   ```bash
   npx vercel
   ```
2. In Vercel Project Settings > **Domains**, add:
   - `gurdaspurproperty.in`
   - `www.gurdaspurproperty.in`
3. In your Domain Registrar (GoDaddy, Hostinger, BigRock, etc.) DNS settings:
   - **Type A**: `@` -> `76.76.21.21`
   - **Type CNAME**: `www` -> `cname.vercel-dns.com`
