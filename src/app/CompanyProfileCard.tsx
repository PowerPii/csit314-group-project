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
    <article className="max-w-2xl rounded border p-6">
      <div className="mb-4 flex items-center gap-4">
        {profile.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.logoUrl} alt={`${profile.companyName} logo`} className="h-16 w-16 rounded object-cover" />
        )}
        <h2 className="text-2xl font-semibold">{profile.companyName}</h2>
      </div>
      {profile.description && <p className="mb-4 whitespace-pre-line">{profile.description}</p>}
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-semibold">{label}</dt>
              <dd className="whitespace-pre-line">{value}</dd>
            </div>
          ))}
        {links.length > 0 && (
          <>
            <dt className="font-semibold">Social media</dt>
            <dd className="flex flex-col">
              {links.map((link) => (
                <a key={link} href={link} target="_blank" rel="noreferrer" className="underline">{link}</a>
              ))}
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
