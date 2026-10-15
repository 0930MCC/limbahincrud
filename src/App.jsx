import { Toaster } from "@/components/ui/toaster"
import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate, useOutletContext, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import RouteSeoGuard from './components/RouteSeoGuard';
import Layout from '@/components/Layout';
const Home = lazy(() => import('@/pages/Home'));
const TentangKami = lazy(() => import('@/pages/TentangKami'));
const HubungiKami = lazy(() => import('@/pages/HubungiKami'));
const JenisLimbah = lazy(() => import('@/pages/layanan/JenisLimbah'));
const ProsesPelayanan = lazy(() => import('@/pages/layanan/ProsesPelayanan'));
const MengapaKami = lazy(() => import('@/pages/layanan/MengapaKami'));
const PartnerKlien = lazy(() => import('@/pages/layanan/PartnerKlien'));
const DaftarHarga = lazy(() => import('@/pages/DaftarHarga'));
const HargaLogistik = lazy(() => import('@/pages/HargaLogistik'));
const AlurLimbah = lazy(() => import('@/pages/layanan/AlurLimbah'));
const FAQ = lazy(() => import('@/pages/bantuan/FAQ'));
const Karir = lazy(() => import('@/pages/bantuan/Karir'));
const Galeri = lazy(() => import('@/pages/Galeri'));
const Artikel = lazy(() => import('@/pages/Artikel'));
const ArtikelDetail = lazy(() => import('@/pages/ArtikelDetail'));
const Promo = lazy(() => import('@/pages/Promo'));
const Affiliate = lazy(() => import('@/pages/Affiliate'));



// Client/office portal
import { PortalAuthProvider } from '@/lib/PortalAuth';
import { ThemeProvider } from '@/lib/ThemeContext';
import PortalLayout from '@/components/portal/PortalLayout';
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Cabang = lazy(() => import('@/pages/Cabang'));
const BranchDetail = lazy(() => import('@/pages/BranchDetail'));
const Mou = lazy(() => import('@/pages/Mou'));
const MouDetail = lazy(() => import('@/pages/MouDetail'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const Perizinan = lazy(() => import('@/pages/Perizinan'));
const Dokumentasi = lazy(() => import('@/pages/Dokumentasi'));
const SudahKomisi = lazy(() => import('@/pages/SudahKomisi'));
const BelumKomisi = lazy(() => import('@/pages/BelumKomisi'));

const BeritaAcara = lazy(() => import('@/pages/BeritaAcara'));
const JadwalCrm = lazy(() => import('@/pages/JadwalCrm'));
const Profile = lazy(() => import('@/pages/Profile'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));

// Asset Records module — merged back in from the standalone asset-records app.
// Field workers keep their own code-based session (lib/ast/workerSession.js), which is what
// scopes every record to a workerId; the office portal reaches the same pages through its own
// sidebar entry at /app/ast (see components/portal/Sidebar.jsx).
import AstWorkerRoute from '@/components/ast/WorkerRoute';
const AstWorkerLogin = lazy(() => import('@/pages/ast/WorkerLogin'));
const AstDashboard = lazy(() => import('@/pages/ast/Dashboard'));
const AstAssetEditor = lazy(() => import('@/pages/ast/AssetEditor'));
const AstDashboard2 = lazy(() => import('@/pages/ast/AssetRecord2Dashboard'));
const AstAssetEditor2 = lazy(() => import('@/pages/ast/AssetRecord2Editor'));

// Customer Form — merged in from the standalone custform app. Public (no auth) and deliberately
// NOT linked from the marketing navbar: people reach it from a CS-issued link or from the
// "Ubah / Lengkapi Data Saya" button in their quotation/contract email.
import { SettingsProvider } from '@/settings/SettingsContext';
const CustForm = lazy(() => import('@/pages/CustForm'));
const SubmissionResult = lazy(() => import('@/pages/SubmissionResult'));
const CustFormSettings = lazy(() => import('@/pages/Settings'));
const TambahReferal = lazy(() => import('@/pages/TambahReferal'));

// The Customer Form family all read the same Supabase-backed pricelist config, so they share one
// provider rather than each mounting their own.
function CustFormShell() {
  return (
    <SettingsProvider>
      <Outlet />
    </SettingsProvider>
  );
}

// /app on its own has no page — send each role to its own home: clients start in Limbah B3, office
// users in Service & MOU (same landing spots Login uses).
function AppIndexRedirect() {
  const { session } = useOutletContext();
  return <Navigate to={session?.role === 'office' ? '/app/service' : '/app/limbahb3/dashboard'} replace />;
}

// The old coming-soon URLs (/app/coming-soon/limbah-domestik, ...) now live at /app/<feature>/dashboard.
function LegacyComingSoonRedirect() {
  const { feature } = useParams();
  return <Navigate to={`/app/${feature}/dashboard`} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <PortalAuthProvider>
        <Router>
          <ThemeProvider>
            <ScrollToTop />
            <RouteSeoGuard />
            <Suspense fallback={null}>
            <Routes>
              {/* Marketing site */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/tentang" element={<TentangKami />} />
                <Route path="/hubungi" element={<HubungiKami />} />
                <Route path="/layanan/jenis-limbah" element={<JenisLimbah />} />
                <Route path="/layanan/proses-pelayanan" element={<ProsesPelayanan />} />
                <Route path="/layanan/mengapa-kami" element={<MengapaKami />} />
                <Route path="/layanan/partner-klien" element={<PartnerKlien />} />
                <Route path="/harga-limbah" element={<DaftarHarga />} />
                <Route path="/harga-logistik" element={<HargaLogistik />} />
                <Route path="/layanan/alur-limbah" element={<AlurLimbah />} />
                <Route path="/bantuan/faq" element={<FAQ />} />
                <Route path="/bantuan/karir" element={<Karir />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/artikel" element={<Artikel />} />
                {/* /artikel/<category> — real, linkable category pages (the article breadcrumbs and
                    JSON-LD already point at these; before, they fell through to the 404 page). */}
                <Route path="/artikel/:category" element={<Artikel />} />
                <Route path="/artikel/:category/:slug" element={<ArtikelDetail />} />

                {/* Old / guessed URLs -> the real page. Keeps links and crawled URLs from ending in a 404.
                    (Add the same 301s on the web server — see seo-notes/htaccess-snippet.txt — so crawlers
                    get a true redirect rather than a JavaScript one.) */}
                <Route path="/partner-klien" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/partner" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/klien" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/layanan/partner" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/layanan/klien" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/layanan/partner-dan-klien" element={<Navigate to="/layanan/partner-klien" replace />} />
                <Route path="/layanan" element={<Navigate to="/layanan/jenis-limbah" replace />} />
                <Route path="/bantuan" element={<Navigate to="/bantuan/faq" replace />} />
                <Route path="/jenis-limbah" element={<Navigate to="/layanan/jenis-limbah" replace />} />
                <Route path="/tentang-kami" element={<Navigate to="/tentang" replace />} />
                <Route path="/hubungi-kami" element={<Navigate to="/hubungi" replace />} />
                <Route path="/kontak" element={<Navigate to="/hubungi" replace />} />
                <Route path="/faq" element={<Navigate to="/bantuan/faq" replace />} />
                <Route path="/karir" element={<Navigate to="/bantuan/karir" replace />} />
                <Route path="/harga" element={<Navigate to="/harga-limbah" replace />} />
                {/**<Route path="/promo" element={<Promo />} />
                 * 
                 *    <Route path="/affiliate" element={<Affiliate />} />
                 */}
              </Route>

              {/* Client/office portal (own layout, no marketing navbar/footer) */}
              <Route path="/login" element={<Login />} />
              <Route path="/app" element={<PortalLayout />}>
                <Route index element={<AppIndexRedirect />} />

                {/* One dashboard per client mode, all at /app/<mode>/dashboard. */}
                <Route path="limbahb3/dashboard" element={<Dashboard />} />
                <Route path="limbah-domestik/dashboard" element={<ComingSoon feature="limbah-domestik" />} />
                <Route path="limbah-ekonomis/dashboard" element={<ComingSoon feature="limbah-ekonomis" />} />
                <Route path="logistik/dashboard" element={<ComingSoon feature="logistik" />} />

                <Route path="cabang" element={<Cabang />} />
                <Route path="cabang/:branchId" element={<BranchDetail />} />
                <Route path="mou" element={<Mou />} />
                <Route path="mou/:mouId" element={<MouDetail />} />
                <Route path="berita-acara" element={<BeritaAcara />} />
                <Route path="jadwal-crm" element={<JadwalCrm />} />
                <Route path="invoice" element={<Invoice />} />
                <Route path="perizinan" element={<Perizinan />} />
                <Route path="dokumentasi" element={<Dokumentasi />} />
                <Route path="sudah-komisi" element={<SudahKomisi office />} />
                <Route path="belum-komisi" element={<BelumKomisi office />} />
                <Route path="service" element={<Mou office />} />
                <Route path="service/:mouId" element={<MouDetail office />} />
                <Route path="office-invoice" element={<Invoice office />} />
                <Route path="profile" element={<Profile />} />
                <Route path="coming-soon/:feature" element={<LegacyComingSoonRedirect />} />

                {/* Asset Records, inside the office portal shell. The pages still require a
                    worker session because every record is keyed by workerId — an office user
                    with no worker session gets the code login inline (see WorkerRoute). */}
                <Route path="ast" element={<AstWorkerRoute portal />}>
                  <Route index element={<AstDashboard portal />} />
                  <Route path="new" element={<AstAssetEditor portal />} />
                  <Route path="edit/:id" element={<AstAssetEditor portal />} />
                </Route>
                {/* AssetRecord2 — own table/sheet/functions; each worker sees only their own rows. */}
                <Route path="ast2" element={<AstWorkerRoute portal />}>
                  <Route index element={<AstDashboard2 portal />} />
                  <Route path="new" element={<AstAssetEditor2 portal />} />
                  <Route path="edit/:id" element={<AstAssetEditor2 portal />} />
                </Route>
              </Route>

              {/* Standalone Asset Records entry, for field workers on their own devices —
                  same pages, outside the portal shell. */}
              <Route path="/ast/login" element={<AstWorkerLogin />} />
              <Route path="/ast" element={<AstWorkerRoute />}>
                <Route index element={<AstDashboard />} />
                <Route path="new" element={<AstAssetEditor />} />
                <Route path="edit/:id" element={<AstAssetEditor />} />
              </Route>
              <Route path="/ast2" element={<AstWorkerRoute />}>
                <Route index element={<AstDashboard2 />} />
                <Route path="new" element={<AstAssetEditor2 />} />
                <Route path="edit/:id" element={<AstAssetEditor2 />} />
              </Route>

              {/* Public Customer Form — own shell, no marketing navbar/footer, and deliberately
                  absent from the navbar: entry is by CS-issued link or the button in the
                  quotation/contract email. /tambahreferal and /settings/:location are the
                  internal pricelist tools that shipped with it. */}
              <Route element={<CustFormShell />}>
                <Route path="/custform" element={<CustForm />} />
                <Route path="/hasil" element={<SubmissionResult />} />
                <Route path="/tambahreferal" element={<TambahReferal />} />
                <Route path="/settings/:location" element={<CustFormSettings />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
            </Suspense>
          </ThemeProvider>
        </Router>
        <Toaster />
      </PortalAuthProvider>
    </QueryClientProvider>
  )
}

export default App
