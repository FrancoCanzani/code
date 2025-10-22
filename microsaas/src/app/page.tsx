import Link from "next/link";
import { getCurrentUser } from "@/features/profiles/api";
import { ProfileDropdown } from "@/features/profiles/components/ProfileDropdown";

export default async function Home() {


  const { user, profile } = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b p-4 md:p-8 inline-flex items-center justify-between w-full">
        <Link href={"/"} className="font-mono font-medium text-xl">
          SaasList
        </Link>
        <div className="inline-flex flex-1 justify-center gap-6 *:font-medium">
          <Link href={"#"}>Browse</Link>
          <Link href={"#"}>Leaderboard</Link>
          <Link href={"#"}>Makers</Link>
          <Link href={"#"}>Newsletter</Link>
          <Link href={"#"}>Sponsors</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href={"/products/new"} className="font-medium">
                New Product
              </Link>
              {profile ? (
                <ProfileDropdown profile={profile} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
