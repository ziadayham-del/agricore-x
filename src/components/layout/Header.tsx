import { createClient } from "@/lib/supabase/server";
import { HeaderUI } from "./HeaderUI";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let farmName = "Unknown Farm";
  if (user) {
    const { data: members } = await supabase
      .from('farm_members')
      .select('farms(name)')
      .eq('user_id', user.id)
      .limit(1);

    if (members && members.length > 0 && members[0].farms) {
      farmName = Array.isArray(members[0].farms) ? (members[0].farms[0] as any).name : (members[0].farms as any).name;
    }
  }

  return <HeaderUI farmName={farmName} />;
}