import StoreMypage from '@/components/store-mypage';

export default function Page(props: {params: {id: string}}) {
  const id = props.params.id
  return (
    <StoreMypage id={id} />
  )
}