import React from "react"
import { getStores } from "@/lib/data"
import Form from "@/components/edit-mypage-form"

export default async function Page() {
  const stores = await getStores() || []
  return (
    <Form stores={stores}/>
  )

}
