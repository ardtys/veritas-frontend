import SiteNav from '@/components/site/SiteNav';
import SiteFooter from '@/components/site/SiteFooter';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <SiteFooter />
    </>
  );
}
