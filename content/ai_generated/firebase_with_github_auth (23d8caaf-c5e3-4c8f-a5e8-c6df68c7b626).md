# Setting up Firebase with GitHub Authentication in JavaScript

This guide will walk you through the process of setting up Firebase authentication
using GitHub as the authentication provider in a JavaScript application.

## Prerequisites

Before you begin, make sure you have:

1. A Firebase project created in the Firebase Console
2. A GitHub account and a registered GitHub OAuth application

## Step 1: Install Firebase SDK

First, install the Firebase SDK in your project:

```bash
npm install firebase
```

## Step 2: Initialize Firebase

Create a file named `firebaseConfig.js` and initialize Firebase with your project's
configuration:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
```

Replace the placeholder values with your actual Firebase project configuration.

## Step 3: Enable GitHub Authentication in Firebase Console

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable GitHub as a sign-in provider
4. Add your GitHub OAuth app's Client ID and Client Secret

## Step 4: Implement GitHub Authentication

Create a file named `auth.js` to handle the authentication process:

```javascript
import { auth } from './firebaseConfig';
import { GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const githubProvider = new GithubAuthProvider();

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    console.log('Successfully signed in with GitHub:', user);
    return user;
  } catch (error) {
    console.error('Error signing in with GitHub:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
```

## Step 5: Use Authentication in Your Application

Now you can use the authentication functions in your application:

```javascript
import { signInWithGitHub, signOutUser } from './auth';

// Sign in button click handler
const handleSignIn = async () => {
  try {
    const user = await signInWithGitHub();
    // Handle successful sign-in (e.g., update UI, store user data)
  } catch (error) {
    // Handle sign-in error
  }
};

// Sign out button click handler
const handleSignOut = async () => {
  try {
    await signOutUser();
    // Handle successful sign-out (e.g., update UI, clear user data)
  } catch (error) {
    // Handle sign-out error
  }
};
```

## Step 6: Handle Authentication State Changes

To keep track of the user's authentication state, you can use an observer:

```javascript
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user);
    // Update UI or perform actions for authenticated user
  } else {
    // User is signed out
    console.log('User is signed out');
    // Update UI or perform actions for signed-out state
  }
});
```

This setup allows you to implement GitHub authentication in your JavaScript
application using Firebase. Remember to handle errors appropriately and secure
your Firebase configuration in production environments.
