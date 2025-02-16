import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/dashboard",
        items: [
          
        ],
      },
     
      {
        title: "Employees",
        icon: Icons.User,
        items: [
          {
            title: "Internal",
            url: "/dashboard/tables/employees",
          },
          {
            title: "Contractors",
            url: "/dashboard/tables?contractors=true",
          },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.Table,
        items: [
          {
            title: "Internal",
            url: "/dashboard/tables?internal=true&payroll=true",
          },
          {
            title: "Contractors",
            url: "/dashboard/tables?contractors=true&payroll=true",
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
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/signin",
          },
        ],
      },
    ],
  },
];
