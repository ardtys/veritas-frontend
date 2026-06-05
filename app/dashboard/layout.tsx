import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-dark" style={{ display: 'flex', minHeight: '100vh', minWidth: '1024px', backgroundColor: '#0C0E0D' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--bg)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
