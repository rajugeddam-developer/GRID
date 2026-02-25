# How to Setup Firebase for G.R.I.D. Club

To get the authentication working, you need to create a project in Firebase and connect it to your code. Follow these exact steps:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or "Create a project").
3. Name it something like `grid-club-app`.
4. Decide if you want Google Analytics (you can turn it off for now to save time) and click **Create Project**.

### Step 2: Enable Email/Password Authentication
1. Once your project is created, click on it to open the dashboard.
2. In the left-hand menu, under **Build**, click on **Authentication**.
3. Click the **Get Started** button.
4. Click on the **Sign-in method** tab.
5. Click on **Email/Password**.
6. Toggle the **Enable** switch to the "On" position (the blue position) and click **Save**.

### Step 3: Get Your Web Configuration Keys
1. Go back to your Firebase Project Overview (click the home icon or "Project Overview" in the top left).
2. You will see a prompt asking you to "Get started by adding Firebase to your app". 
3. Click the Web icon `</>`.
4. Register the app with a nickname (e.g., `grid-frontend`). You don't need to check Firebase Hosting. Click **Register app**.
5. You will now see a block of code containing your `firebaseConfig`. It will look exactly like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDoXQ...",
     authDomain: "grid-club-app.firebaseapp.com",
     projectId: "grid-club-app",
     storageBucket: "grid-club-app.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:1234:web:abcd"
   };
   ```

### Step 4: Add the Keys to Your Code
1. Copy the **entire** `firebaseConfig` block from Firebase.
2. Open the file `c:\Html workspace\GridProject\frontend\src\js\auth.js`.
3. Highlight lines **10 through 17** (the current placeholder config).
4. Paste your real `firebaseConfig` block over it and save the file! 

That’s it! The Web App will now automatically connect to your live Firebase database. Go to `http://localhost:3000/register.html` to create your first account!
