import Link from "next/link";
import { ui } from "./ui";

// A GET search form: submitting puts the text in the URL (?name=value), so results can be bookmarked.
export function SearchBox({
  name,
  value,
  placeholder,
  clearHref,
}: {
  name: string;
  value?: string;
  placeholder: string;
  clearHref: string;
}) {
  return (
    <form className="mb-4 flex flex-wrap items-center gap-2">
      <input name={name} defaultValue={value} placeholder={placeholder} className={`${ui.input} w-72`} />
      <button type="submit" className={ui.button}>Search</button>
      {value && <Link href={clearHref} className={ui.link}>Clear</Link>}
    </form>
  );
}
