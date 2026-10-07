import '@/styles/print-document.css';

/**
 * Layout dùng cho trình duyệt ngầm (headless) khi render trang in PDF
 */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white flex justify-center items-start p-0">
      {children}
    </div>
  );
}
