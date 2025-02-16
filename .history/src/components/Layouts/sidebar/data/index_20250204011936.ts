import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/dashboard",
          },
        ],
      },
     
      {
        title: "Employees",
        icon: Icons.User,
        items: [
          {
            title: "Internal",
            url: "/dashboard/tables?m",
          },
          {
            title: "Contractors",
            url: "/dashboard/tables",
          },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.Table,
        items: [
          {
            title: "Internal",
            url: "/dashboard/tables",
          },
          {
            title: "Contractors",
            url: "/dashboard/tables",
          },
        ],
      },
      {
        title: "Reporting",
        url: "/tables",
        icon: Icons.PieChart,
        items: [
          {
            title: "Tables",
            url: "/dashboard/tables",
          },
        ],
      },
     
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/dashboard/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/dashboard/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/dashboard/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
