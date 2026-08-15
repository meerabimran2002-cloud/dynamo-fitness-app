import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useIsAdmin } from "@/hooks/use-session";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — IRON PULSE Gym" },
      {
        name: "description",
        content: "Manage Iron Pulse memberships, booking requests and member enquiries.",
      },
      { property: "og:title", content: "Admin Dashboard — IRON PULSE Gym" },
      { property: "og:description", content: "Internal dashboard for Iron Pulse staff." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useSession();
  const isAdmin = useIsAdmin(user?.id);
  const qc = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,status,created_at,user_id,plans(name,price)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id,name,email,message,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Booking ${status}`);
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    }
  }

  if (loading || isAdmin === null) {
    return <Shell>Loading...</Shell>;
  }

  if (!user || !isAdmin) {
    return <Shell>You do not have access to this page.</Shell>;
  }

  return (
    <Shell>
      <h1 className="font-display text-5xl uppercase">
        Admin <span className="text-fire">Dashboard</span>
      </h1>

      <section className="mt-10">
        <h2 className="font-display text-2xl uppercase text-secondary">Membership requests</h2>
        <div className="mt-4 space-y-3">
          {(bookings ?? []).map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
            >
              <div className="min-w-0">
                <p className="font-semibold">{b.plans?.name ?? "Unknown plan"}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(b.created_at).toLocaleString()} · status: {b.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="rounded-full bg-fire" onClick={() => setStatus(b.id, "confirmed")}>
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setStatus(b.id, "cancelled")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
          {bookings?.length === 0 && <p className="text-muted-foreground">No requests yet.</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase text-secondary">Contact messages</h2>
        <div className="mt-4 space-y-3">
          {(messages ?? []).map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold">
                {m.name} <span className="text-sm text-muted-foreground">· {m.email}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{m.message}</p>
            </div>
          ))}
          {messages?.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        {children}
      </div>
    </div>
  );
}
