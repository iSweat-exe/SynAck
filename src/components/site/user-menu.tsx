"use client";

import { Menu } from "@base-ui/react/menu";
import { LayoutDashboard, LogIn, LogOut, Palette, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type MenuUser = {
  name: string;
  email?: string;
  avatarUrl?: string;
  canUseCms: boolean;
};

type State =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: MenuUser };

function textOf(value: unknown) {
  return typeof value === "string" && value !== "" ? value : undefined;
}

// The account corner of the header: the profile picture, and a menu with the profile, the back office
// (only with the `cms.access` permission) and the sign-out. It reads the session in the browser so the
// pages themselves stay static; until it knows, it shows a placeholder of the same size.
export function UserMenu() {
  const [state, setState] = useState<State>(() =>
    getSupabaseEnv() ? { status: "loading" } : { status: "signed-out" },
  );

  useEffect(() => {
    if (!getSupabaseEnv()) return;
    const supabase = createClient();
    let active = true;

    async function load() {
      // getUser() checks the token with Supabase; the cookie alone is never trusted.
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      const user = data.user;
      if (!user) {
        setState({ status: "signed-out" });
        return;
      }

      const { data: canUseCms } = await supabase.rpc("has_permission", {
        p_permission: "cms.access",
      });
      if (!active) return;

      const meta = user.user_metadata;
      setState({
        status: "signed-in",
        user: {
          name:
            textOf(meta.user_name) ??
            textOf(meta.full_name) ??
            textOf(meta.name) ??
            user.email ??
            "Compte SynAck",
          email: user.email ?? undefined,
          avatarUrl: textOf(meta.avatar_url) ?? textOf(meta.picture),
          canUseCms: canUseCms === true,
        },
      });
    }

    load();
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") setState({ status: "signed-out" });
      if (event === "SIGNED_IN") load();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (state.status === "loading") {
    return (
      <span aria-hidden className="avatar opacity-40">
        <span />
      </span>
    );
  }

  if (state.status === "signed-out") {
    return (
      <Button size="sm" render={<Link href="/sign-in" />} nativeButton={false}>
        <LogIn aria-hidden />
        Se connecter
      </Button>
    );
  }

  return <AccountMenu user={state.user} />;
}

// The avatar and its menu, for a signed-in user (also shown on /design-system with a sample account).
export function AccountMenu({ user }: { user: MenuUser }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className="avatar-button"
        aria-label={`Menu du compte de ${user.name}`}
      >
        <Avatar name={user.name} src={user.avatarUrl} size={44} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={14}>
          <Menu.Popup className="menu-popup">
            <div className="menu-label">
              <p className="truncate font-bold">{user.name}</p>
              {user.email ? (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              ) : null}
            </div>
            <Menu.Separator className="menu-separator" />

            <Menu.LinkItem
              className="menu-item"
              render={<Link href="/profile" />}
            >
              <User aria-hidden />
              Mon profil
            </Menu.LinkItem>

            {user.canUseCms ? (
              <>
                <Menu.LinkItem
                  className="menu-item"
                  render={<Link href="/admin" prefetch={false} />}
                >
                  <LayoutDashboard aria-hidden />
                  Panel admin
                </Menu.LinkItem>
                <Menu.LinkItem
                  className="menu-item"
                  render={<Link href="/design-system" />}
                >
                  <Palette aria-hidden />
                  Design system
                </Menu.LinkItem>
              </>
            ) : null}

            <Menu.Separator className="menu-separator" />

            <form method="post" action="/auth/signout">
              <Menu.Item
                className="menu-item menu-item-danger"
                render={<button type="submit" />}
                nativeButton
              >
                <LogOut aria-hidden />
                Se déconnecter
              </Menu.Item>
            </form>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
