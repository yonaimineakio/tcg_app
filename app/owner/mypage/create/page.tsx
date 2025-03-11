import React from "react"
import { getStores } from "@/lib/data"
import Form from "@/components/create-mypage-form"

export default async function Page() {
  const stores = await getStores() || []
  return (
    <Form stores={stores}/>
  )

}
