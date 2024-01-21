import Image from "next/image"
import { notFound } from "next/navigation"

export default async function Home({
    params
}: {
    params: {
        fileId: string
    }
}) {
    const { fileId } = params

    const fileUrlReq = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL!}/get`, {
        method: 'POST',
        body: JSON.stringify({ fileId }),
        next: {
            revalidate: 0
        }
    })

    const fileUrl = await fileUrlReq.json()

    if (fileUrl.message === "Max opening reached") {
        return notFound()
    }

    return (
        <main className="">
            <Image src={fileUrl.data.url} alt="file" width={500} height={500} />
        </main>
    )
}
