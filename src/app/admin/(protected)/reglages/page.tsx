import { getSettings } from "@/server/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="display display-sm">Réglages</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Ces informations alimentent le pied de page, la page « Le lieu & contact » et les messages affichés dans les
        formulaires.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
