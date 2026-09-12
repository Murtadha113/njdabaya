"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react"
import { cn, imgSrc } from "@/lib/utils"

const MIN_SCALE = 1
const MAX_SCALE = 4

export function ProductImageLightbox({
  images,
  name,
  index,
  onIndexChange,
  onClose,
}: {
  images: string[]
  name: string
  index: number
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    setScale(1)
    setPos({ x: 0, y: 0 })
  }, [index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onIndexChange((index + 1) % images.length)
      if (e.key === "ArrowRight") onIndexChange((index - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, images.length, onIndexChange, onClose])

  function clampScale(s: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
  }

  function toggleZoom(clientX: number, clientY: number) {
    if (scale > 1) {
      setScale(1)
      setPos({ x: 0, y: 0 })
      return
    }
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const offsetX = clientX - (rect.left + rect.width / 2)
    const offsetY = clientY - (rect.top + rect.height / 2)
    setScale(2.5)
    setPos({ x: -offsetX * 1.5, y: -offsetY * 1.5 })
  }

  function onPointerDown(e: React.PointerEvent) {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      pinchStart.current = { dist, scale }
      panStart.current = null
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const next = clampScale(pinchStart.current.scale * (dist / pinchStart.current.dist))
      setScale(next)
    } else if (pointers.current.size === 1 && panStart.current && scale > 1) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setPos({ x: panStart.current.px + dx, y: panStart.current.py + dy })
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) panStart.current = null
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setScale((s) => clampScale(s + (e.deltaY < 0 ? 0.3 : -0.3)))
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-100 flex flex-col bg-black/95" dir="rtl">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white/70">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => clampScale(s - 0.5))}
            className="flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
            aria-label="تصغير"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={() => setScale((s) => clampScale(s + 0.5))}
            className="flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
            aria-label="تكبير"
          >
            <Plus className="size-4" />
          </button>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 touch-none overflow-hidden select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onDoubleClick={(e) => toggleZoom(e.clientX, e.clientY)}
      >
        <div
          className={cn("relative size-full", scale > 1 ? "cursor-grab" : "cursor-zoom-in")}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: pointers.current.size > 0 ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Image
            src={imgSrc(images[index])}
            alt={name}
            fill
            sizes="100vw"
            className="object-contain"
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
              className="absolute end-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              aria-label="السابقة"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => onIndexChange((index + 1) % images.length)}
              className="absolute start-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              aria-label="التالية"
            >
              <ChevronLeft className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
