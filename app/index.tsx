
import React from 'react';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  console.log('Redirecting to dashboard - skipping login flow');
  // Skip login/office creation and go directly to dashboard
  return <Redirect href="/dashboard" />;
}
