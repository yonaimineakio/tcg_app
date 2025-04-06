// app/user/stores/[id]/page.tsx
import StoreMypage from '@/components/store-mypage';
import { Suspense } from 'react';
import Loading from '@/app/loading';
// 正しいページパラメータの型定義
interface PageParams {
  id: string;
}

// サーバーコンポーネントとして実装
export default async function Page({
  params,
}: {
  params: PageParams;
}) {
  // クライアントコンポーネントを通常通り使用可能
  return <Suspense fallback={<Loading />}>
    <StoreMypage id={params.id} />
  </Suspense>;
}