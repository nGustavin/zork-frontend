import { useEffect } from "react";
import { useState } from "react";

import { useCookies } from "react-cookie";
import Router from "next/router";
import { api } from "src/utils/api";

import type { User } from "./utils";

/**
 * React hook that give information about the authenticated user. Also returns the access token to make other requests.
 * The Access Token and User information are stored in the cookie jar.
 * @param redirectTo The url to redirect if use is not authenticated, if set to undefined, it doesn't redirect to any page. Default: undefined.
 * @param redirectIfFound Should redirect if found user instead of if not found? Default: false.
 * @returns The access token and the User object
 */
const useUser = (
  redirectTo: string = "/login",
  redirectIfFound: boolean = false
): { access_token: string; user: User; reloadUser: () => void } => {
  const [cookies, setCookies, removeCookies] = useCookies([
    "access_token",
    "user",
  ]);

  const reloadUser = () => {
    removeCookies("user");
  };

  const getUser = async () => {
    try {
      // Try to fetch User information
      const response = await api.get("/user", {
        headers: {
          authorization: "Bearer " + cookies.access_token,
        },
      });

      // Sets the new User information
      setCookies("user", response.data, {
        path: "/",
        sameSite: true,
        maxAge: 0,
      });

      // Check if should redirect if found User
      if (redirectIfFound && redirectTo) {
        Router.push(redirectTo);
      }
    } catch (err) {
      // Check if is a axios http error
      if (!err.response) {
        throw err;
      }

      // Check if is code 403
      if (err.response.status == 403) {
        // Check if should redirect if not found
        if (!redirectIfFound && redirectTo) {
          Router.push(redirectTo);
        } else {
          removeCookies("user");
        }
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    // check if has access_token cookie
    if (!cookies.access_token && !redirectIfFound && redirectTo) {
      Router.push(redirectTo);
      return;
    }

    // check if has User in cookies
    if (!cookies.user) {
      getUser();
    }
  }, [cookies.access_token, cookies.user]);

  return { access_token: cookies.access_token, user: cookies.user, reloadUser };
};

export { useUser };
