import { Storage } from "@google-cloud/storage"

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url)
    const filename = searchParams.get("file")
    if (!filename) {
        return NextResponse.json({ error: "file query parameter is required" }, { status: 400 })
    }


    const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID,
        credentials: JSON.parse(process.env.GCP_APPLICATION_CREDENTIALS || '{}')
    })

    


    const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET!)
    const file = bucket.file(filename)
    const options = {
        expires: Date.now() + 1000 * 60 * 60,
        fields: {'x-goog-meta-test': 'data'} 
    }
    try {
        const [response] = await file.generateSignedPostPolicyV4(options);
        console.log(NextResponse.json(response))
        return NextResponse.json(response)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "An error occurred" }, { status: 500 })
    }



}