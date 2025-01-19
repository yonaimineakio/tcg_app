export default async function Page(props: {params : Promise<{id: string}>}) {
  const params = await props.params
  const id = params.id

  return (
    <h1>This is myPage edit Page{id}</h1>
  )
}