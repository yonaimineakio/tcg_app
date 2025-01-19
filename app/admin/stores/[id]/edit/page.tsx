export default async function Page({ params }: { params: { id: string } }) {
  return (
    <h1>This is store edit Page {params.id}</h1>
  )
}