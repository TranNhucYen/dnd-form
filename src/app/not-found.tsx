import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="absolute left-6 top-6 z-10 flex items-center gap-2 sm:left-8 sm:top-8">
        <Image src="/icon.svg" alt="Logo dnd Form" width={24} height={24} className="rounded-sm" />
        <span className="text-sm font-semibold">dnd Form</span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[52vw] left-1/2 h-[88vw] max-h-[900px] min-h-[520px] w-[74vw] min-w-[520px] -translate-x-1/2 rounded-t-full border-[min(12vw,120px)] border-b-0 border-muted/40 bg-gradient-to-b from-muted/20 to-transparent"
      >
        <div className="absolute inset-[min(5vw,52px)] rounded-t-full border border-border/40 border-b-0" />
      </div>

      <section className="relative z-10 flex flex-col items-center">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          404 <span className="px-1 text-muted-foreground">|</span> Không tìm thấy trang
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Trang này không tồn tại.
          <br />
          Hãy quay về trang chủ để tiếp tục.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-xs font-medium text-background transition-opacity hover:opacity-80"
        >
          Về trang chủ
        </Link>
      </section>
    </main>
  )
}
