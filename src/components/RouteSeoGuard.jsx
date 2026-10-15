import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Private / tool routes: the client portal, worker tools, the customer form and the internal
// pricelist tools. None of these should ever appear in Google, and — importantly — none of them
// mount <Seo />, so without this guard they inherit whatever <link rel="canonical"> is hard-coded
// in index.html (normally the homepage). Google then reports each of them as
// "Alternate page with proper canonical tag". This marks them noindex and drops that canonical.
const PRIVATE_PREFIXES = ['/app', '/login', '/ast', '/ast2', '/custform', '/hasil', '/tambahreferal', '/settings'];

export function isPrivatePath(pathname) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function RouteSeoGuard() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!isPrivatePath(pathname)) return;
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  }, [pathname]);
  return null;
}
