import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // クエリパラメータからファイル名を取得
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("file");
  if (!filename) {
    return NextResponse.json(
      { error: "file query parameter is required" },
      { status: 400 }
    );
  }

  // Google Cloud Storage の設定（環境変数から値を取得）
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_APPLICATION_CREDENTIALS, // JSONファイルのパスまたは環境変数からパース済みの内容
  });

  const bucketName = process.env.GCP_STORAGE_BUCKET!;
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  // 署名付きURLを取得するためのオプション
  const options = {
    version: "v4" as const,
    action: "read" as const, // 読み取り用
    expires: Date.now() + 60 * 60 * 1000, // 現在から1時間後に期限切れ
  };

  try {
    const [signedUrl] = await file.getSignedUrl(options);
    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "An error occurred while generating signed URL" },
      { status: 500 }
    );
  }
}
