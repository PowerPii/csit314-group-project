import type { CompanyProfile } from "@/entity/CompanyProfile";

// A company profile as customers see it. Used by ID #4 (preview) and Customer #7.
export function CompanyProfileCard({ profile }: { profile: CompanyProfile }) {
  const rows: [string, string | null][] = [
    ["Contact email", profile.contactEmail],
    ["Contact phone", profile.contactPhone],
    ["Accreditation and licences", profile.accreditation],
    ["Awards", profile.awards],
    ["Property types", profile.propertyTypes],
    ["Service areas", profile.serviceAreas],
  ];
  const links = (profile.socialLinks ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  return (
    <article className="max-w-2xl rounded-3xl border bg-white p-8">
      <div className="mb-4 flex items-center gap-4">
        {profile.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.logoUrl} alt={`${profile.companyName} logo`} className="h-16 w-16 rounded-2xl object-cover" />
        )}
        <h2 className="font-serif text-3xl tracking-tight">{profile.companyName}</h2>
      </div>
      {profile.description && <p className="mb-6 whitespace-pre-line leading-7 text-[#4a524d]">{profile.description}</p>}
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 border-t border-line-soft pt-6 text-sm">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="whitespace-pre-line">{value}</dd>
            </div>
          ))}
        {links.length > 0 && (
          <>
            <dt className="text-muted">Social media</dt>
            <dd className="flex flex-col">
              {links.map((link) => (
                <a key={link} href={link} target="_blank" rel="noreferrer" className="font-medium text-accent underline-offset-4 hover:underline">{link}</a>
              ))}
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
