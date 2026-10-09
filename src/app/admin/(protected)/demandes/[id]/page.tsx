import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectRequests, requestNotes } from "@/db/schema";
import { projectTypes, requestKinds, requestStatuses } from "@/config/site";
import { getSettings } from "@/server/settings";
import { DeleteRequestForm, NoteForm, StatusForm } from "./RequestPanels";

export const dynamic = "force-dynamic";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  );
}

export default async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [rows, notes, settings] = await Promise.all([
    db.select().from(projectRequests).where(eq(projectRequests.id, numericId)).limit(1),
    db.select().from(requestNotes).where(eq(requestNotes.requestId, numericId)).orderBy(asc(requestNotes.createdAt)),
    getSettings(),
  ]);
  const request = rows[0];
  if (!request) notFound();

  const typeLabel = projectTypes.find((p) => p.value === request.projectType)?.label ?? request.projectType ?? "—";

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Link href="/admin/demandes" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
          ← Toutes les demandes
        </Link>
        <h1 className="display display-sm mt-5">{request.reference}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {requestKinds[request.kind] ?? request.kind} ·{" "}
          {new Date(request.createdAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
        </p>

        <dl className="mt-8 border-t border-line">
          <Row label="Nom">{request.name}</Row>
          <Row label="Email">
            <a className="underline underline-offset-4" href={`mailto:${request.email}?subject=Votre projet ${request.reference}`}>
              {request.email}
            </a>
          </Row>
          <Row label="Téléphone">{request.phone ?? "—"}</Row>
          <Row label="Type de projet">{typeLabel}</Row>
          <Row label="Délai souhaité">{request.deadline ?? "—"}</Row>
          <Row label="Produit">
            {request.productSlug ? (
              <Link className="underline underline-offset-4" href={`/solutions/${request.productSlug}`}>
                {request.productSlug}
              </Link>
            ) : (
              "—"
            )}
          </Row>
          <Row label="Message">
            <p className="whitespace-pre-wrap leading-relaxed">{request.message}</p>
          </Row>
          <Row label="Fichier">
            {request.attachmentName ? (
              <>
                {request.attachmentName}
                {request.attachmentSize ? ` · ${Math.round(request.attachmentSize / 1024)} Ko` : ""}
                {!settings.services.fileUpload && (
                  <span className="mt-1 block text-xs text-espresso">
                    Non transmis : le transfert de fichiers n’est pas activé. Le client doit encore vous l’envoyer.
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
          </Row>
          {request.details != null && (
            <Row label="Détails">
              <pre className="overflow-x-auto whitespace-pre-wrap break-words bg-sand/40 p-4 font-mono text-xs">
                {JSON.stringify(request.details, null, 2)}
              </pre>
            </Row>
          )}
        </dl>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Notes internes</h2>
          {notes.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">Aucune note.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="border border-line bg-ivory p-4 text-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{n.body}</p>
                  <p className="mt-2 text-xs text-ink-soft">
                    {n.author} · {new Date(n.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 border border-line bg-ivory p-5">
            <NoteForm id={request.id} />
          </div>
        </section>
      </div>

      <aside className="space-y-8">
        <div className="border border-line bg-ivory p-5">
          <StatusForm id={request.id} status={request.status} />
          <p className="mt-4 text-xs text-ink-soft">
            Actuel : {requestStatuses.find((s) => s.value === request.status)?.label ?? request.status}
            {request.handledAt && ` · traité le ${new Date(request.handledAt).toLocaleDateString("fr-FR")}`}
          </p>
        </div>
        <div className="border border-line bg-ivory p-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">Répondre</p>
          <a
            href={`mailto:${request.email}?subject=Votre projet ${request.reference}`}
            className="mt-3 inline-flex min-h-11 items-center bg-espresso px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ivory"
          >
            Écrire au client ↗
          </a>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            L’envoi automatique d’emails n’est pas connecté : les réponses partent de votre messagerie.
          </p>
        </div>
        <DeleteRequestForm id={request.id} />
      </aside>
    </div>
  );
}
