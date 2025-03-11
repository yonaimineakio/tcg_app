import React from 'react'
import Form from '@/components/edit-store-form'
import { getStores } from '@/lib/data'

export default async function Page() {

  const stores = await getStores() || []
  return (
    <Form stores={stores}/>
  )
}