"use client"

import { useState } from "react"
import Image from "next/image"
import { cn, imgSrc } from "@/lib/utils"

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState("50% 50%")

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setActive(i)}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-md border-2 md:size-20",
              active === i ? "border-foreground" : "border-transparent"
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div
        className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-muted"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          setOrigin(`${x}% ${y}%`)
        }}
      >
        <Image
          src={imgSrc(images[active])}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ transformOrigin: origin }}
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            zoom && "scale-150"
          )}
        />
      </div>
    </div>
  )
}
