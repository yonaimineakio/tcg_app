// app/user/stores/[id]/page.tsx
import StoreMypage from '@/components/store-mypage';


export default async function Page(props: { params: Promise<{ id: string }> }) {
  
  const params = await props.params;
  return <StoreMypage id={params.id} />
}