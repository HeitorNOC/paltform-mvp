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
    title: "Barbers",
    path: "/barbers",
  },
  {
    title: "Cuts",
    path: "/cuts",
  },
  {
    title: "Courses",
    path: "/courses",
  },
  {
    title: "History",
    path: "/history",
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
    title: "Catalog",
    path: "/catalog",
  },
  {
    title: "Sales",
    path: "/sales",
  },
  {
    title: "Purchases",
    path: "/purchases",
  },
  {
    title: "Finance",
    path: "/finance",
  },
  {
    title: "Reports",
    path: "/reports",
  },
  {
    title: "Settings",
    path: "/settings",
  },
]

export const BARBER_LINKS = [
  {
    title: "Barber",
    path: "/client",
  },
  {
    title: "Time",
    path: "/barber/time-intervals",
  },
  {
    title: "Catalog",
    path: "/catalog",
  },
  {
    title: "Sales",
    path: "/sales",
  },
  {
    title: "Purchases",
    path: "/purchases",
  },
  {
    title: "Finance",
    path: "/finance",
  },
  {
    title: "Reports",
    path: "/reports",
  },
  {
    title: "Settings",
    path: "/settings",
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
