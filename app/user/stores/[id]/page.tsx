import StoreMypage from '@/components/store-mypage';

type Props = {
  params: {
    id: string;
  };
};

export default function Page(props: Props) {
  const { id } = props.params;
  return (
    <StoreMypage id={id} />
  )
}