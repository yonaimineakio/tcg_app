import StoreMypage from '@/components/store-mypage';

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Page({ params }: PageProps) {
  const { id } = params;
  
  return (
    <StoreMypage id={id} />
  );
}