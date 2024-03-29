"use client"

import { Uploader } from '@/components/uploader'
import { useState } from 'react'


export default function Home() {
  const [url, setUrl] = useState("")

  const upload: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    const file = document.querySelector<HTMLInputElement>('#file-upload')?.files?.[0]
    if (!file) return

    const fileToBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL!}/upload`, {
      method: 'POST',
      body: fileToBase64,
    })
    const { data: { id } } = await res.json()

    const horstname = window.location.hostname
    const protocol = window.location.protocol
    const port = window.location.port
    const url = `${protocol}//${horstname}${port ? `:${port}` : ""}/${id}`

    setUrl(url)
  }

  return (
    <main className="">
      <Uploader
        onUpload={upload}
        url={url}
      />
    </main>
  )
}
