import React from 'react';
import { getStores } from '@/lib/data';
import { Store } from '@/lib/definitions';
import Form from '@/components/create-event-form';

export default async function Page() {
  const stores = await getStores() as Store[];

  return (
      <Form stores={stores}/>
  );
}
