import { AppRoot } from "@/components/layout/AppRoot";
import { AppShell } from "@/components/layout/AppShell";
import { AppStateProvider } from "@/providers/AppStateProvider";

export default function Page() {
  return (
    <AppStateProvider>
      <AppShell>
        <AppRoot />
      </AppShell>
    </AppStateProvider>
  );
}