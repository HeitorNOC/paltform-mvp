export const USER_LINKS = [
  {
    title: "Client",
    path: "/client",
  },
  {
    title: "Schedule",
    path: "/schedule",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const ADMIN_LINKS = [
  {
    title: "Admin",
    path: "/admin",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const BARBER_LINKS = [
  {
    title: "Settings",
    path: "/settings",
  },
  {
    title: "Time Intervals",
    path: "/barber/time-intervals",
  },
]

export const ROLES = {
  BARBER: "BARBER",
  USER: "USER",
  ADMIN: "ADMIN"
}

export interface Link {
  title: string;
  path: string;
}

export interface RoleLinks {
  ADMIN: Link[];
  BARBER: Link[];
  USER: Link[];
}

export const links: RoleLinks = {
  ADMIN: ADMIN_LINKS,
  BARBER: BARBER_LINKS,
  USER: USER_LINKS
};