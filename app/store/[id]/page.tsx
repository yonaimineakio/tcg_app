export default async function Page({ params }: { params: { id: string } }) {
    return (
      <h1>This is store show Page {params.id}</h1>
    )
  }