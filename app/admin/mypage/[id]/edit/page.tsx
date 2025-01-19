export default async function Page({ params }: { params: { id: string } }) {
  return (
    <h1>This is myPage edit Page{params.id}</h1>
  )
}