"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useNotificationStore } from '@/app/store/Notification';

export default function App() {
 
  useEffect(() => {
    const store = useNotificationStore.getState();
    store.checkNotificationPermission();
  }, []);
  redirect('/page/football');

}
