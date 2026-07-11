"use client";
import { useState, useRef } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, ChevronRight, MessageCircle, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "~/education/lib/utils";
import { Button } from "~/education/components/ui/button";
import { Menu, MenuItem } from "~/education/components/ui/navbar-menu";
import { destinations, navbarDestinations } from "~/education/lib/destinations";
import { studentServices } from "~/education/lib/studentServices";
import { courses } from "~/education/lib/courses";
import { DestinationsDropdown } from "~/education/components/ui/DestinationsDropdown";
import { StudentServicesDropdown } from "~/education/components/ui/StudentServicesDropdown";
import { CoursesDropdown } from "~/education/components/ui/CoursesDropdown";

const WHATSAPP_NUMBER = "923701902128"; // PK: +92 370 1902128 (no + for wa.me)

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";

  const handleWrapperLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as Node | null;
    if (related && dropdownRef.current?.contains(related)) return;
    setActive(null);
  };

  return (
    <>
      {/* Wrapper: no min-height so dropdown doesn't push content; leave closes unless moving to dropdown */}
      <div
        className="sticky top-0 z-[100] w-full bg-white"
        onMouseLeave={handleWrapperLeave}
      >
        {/* NAVBAR BAR */}
        <div className={cn("shadow-md h-20 w-full", className)}>
          <div className="relative w-full max-w-7xl mx-auto h-full flex items-center px-3 sm:px-5 md:px-6 lg:px-4">
            
            <Link
              to="/"
              className="flex items-center shrink-0 mr-auto py-2"
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={() => setActive(null)}
            >
              <img src="/logo.png" alt="ProConsulting" className="h-11 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-x-6">
               <Link to="/" className="font-medium text-neutral-700 hover:text-black whitespace-nowrap text-sm lg:text-base py-2" onMouseEnter={() => setActive(null)}>Home</Link>
               <Menu setActive={setActive}>
                  <MenuItem setActive={setActive} active={active} item="Destinations">{null}</MenuItem>
                  <MenuItem setActive={setActive} active={active} item="Services">{null}</MenuItem>
                  <MenuItem setActive={setActive} active={active} item="Courses">{null}</MenuItem>
               </Menu>
               <Link to="/education/blog" className="font-medium text-neutral-700 hover:text-black whitespace-nowrap text-sm lg:text-base py-2" onMouseEnter={() => setActive(null)}>Blogs</Link>
               <Link to="/education/about" className="font-medium text-neutral-700 hover:text-black whitespace-nowrap text-sm lg:text-base py-2" onMouseEnter={() => setActive(null)}>About Us</Link>
            </div>

            <div className="hidden lg:block shrink-0 ml-auto" onMouseEnter={() => setActive(null)}>
              <Link to="/education/contact">
                <Button className="rounded-full px-5 py-2.5 text-sm font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-transform hover:scale-[1.02] whitespace-nowrap">
                  Get Free Consultation
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-black z-50 bg-transparent"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Full-width dropdown panel: fixed so it overlays content and doesn't push it down */}
        {active != null && (
          <div
            ref={dropdownRef}
            className="fixed left-0 right-0 top-20 w-full min-h-[340px] bg-[#FAFAFA] border-t border-slate-200/80 shadow-xl rounded-b-2xl px-8 md:px-12 lg:px-16 py-8 z-[99]"
            onMouseLeave={() => setActive(null)}
          >
            {active === "Destinations" && <DestinationsDropdown />}
            {active === "Services" && <StudentServicesDropdown />}
            {active === "Courses" && <CoursesDropdown />}
          </div>
        )}
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
            className="fixed inset-0 z-[120] bg-white flex flex-col lg:hidden overflow-y-auto"
          >
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img src="/logo.png" alt="ProConsulting" className="h-9 w-auto object-contain" />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-6 h-6 text-black" />
              </button>
            </div>
            
             {/* Links */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Destinations</h3>
                <div className="grid grid-cols-2 gap-3">
                  {navbarDestinations.map((d) => (
                    <MobileBoxLink key={d.id} to={d.link} setOpen={setMobileMenuOpen}>{d.name}</MobileBoxLink>
                  ))}
                </div>
                <Link
                  to="/education/destinations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 mt-3"
                  style={{
                    borderColor: "rgba(255, 77, 109, 0.5)",
                    background: "linear-gradient(135deg, rgba(255, 77, 109, 0.08), rgba(225, 29, 72, 0.05))",
                  }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md" style={{ background: "linear-gradient(135deg, #FF4D6D, #E11D48)" }}>
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-[#0B1B3A] group-hover:text-[#FF4D6D] transition-colors">View all destinations</span>
                    <p className="text-sm text-slate-600 mt-0.5">{destinations.length} countries & regions</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[#FF4D6D] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Services</h3>
                {studentServices.map((s) => (
                  <MobileLink key={s.id} to={s.link} setOpen={setMobileMenuOpen}>{s.title}</MobileLink>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Courses</h3>
                <Link
                  to="/education/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex flex-col items-center justify-center gap-2 p-5 rounded-2xl min-h-[100px] text-white transition-all duration-200 hover:opacity-95"
                  style={{ background: "linear-gradient(135deg, #0B1B3A, #162d4d)" }}
                >
                  <LayoutGrid className="h-7 w-7 text-white" />
                  <span className="text-base font-bold">View all courses</span>
                  <span className="text-xs text-white/70">({courses.length} areas)</span>
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blogs</h3>
                <MobileLink to="/education/blog" setOpen={setMobileMenuOpen}>Latest News</MobileLink>
                <MobileLink to="/events" setOpen={setMobileMenuOpen}>Upcoming Events</MobileLink>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company</h3>
                <MobileLink to="/" setOpen={setMobileMenuOpen}>Home</MobileLink>
               <MobileLink to="/education/about" setOpen={setMobileMenuOpen}>About Us</MobileLink>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
               <Link to="/education/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full py-3.5 text-base rounded-xl font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-md">
                    Get Free Consultation
                  </Button>
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky action buttons (mobile & tablet only) – hidden on contact page */}
      {!isContactPage && (
        <>
          {/* WhatsApp – bottom-right, icon only */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden fixed bottom-6 right-6 z-[110] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 border-2 border-white/20"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="h-8 w-8 shrink-0" />
          </a>
        </>
      )}
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Helpers
function MobileLink({ to, children, setOpen }: { to: string, children: React.ReactNode, setOpen: (v: boolean) => void }) {
  return (
    <Link to={to} className="flex items-center justify-between text-lg font-medium text-black hover:text-pink-600 transition-colors group" onClick={() => setOpen(false)}>
      {children}
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-600" />
    </Link>
  )
}
function MobileBoxLink({ to, children, setOpen }: { to: string, children: React.ReactNode, setOpen: (v: boolean) => void }) {
  return (
    <Link to={to} className="block p-3 text-center bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold text-black hover:bg-pink-50 hover:border-pink-100 hover:text-pink-600 transition-all" onClick={() => setOpen(false)}>
      {children}
    </Link>
  )
}
