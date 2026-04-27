"use client";

import { Navbar } from "~/immigration/components/ui/Navbar";
import { Footer } from "~/immigration/components/ui/footer";
import type { Route } from "./+types/things-to-do";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Things to do | ProConsulting Immigration" },
    { name: "description", content: "Things to do – ProConsulting Immigration" },
  ];
}

export default function ThingsToDo() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0B1B3A] mb-4">Things to do</h1>
        <p className="text-slate-600">Content for this page can be added here.</p>
      </main>
      <Footer />
    </>
  );
}
