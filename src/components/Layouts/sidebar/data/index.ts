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
            url: "/dashboard/employees/internal",
          },
          {
            title: "Contractors",
            url: "/dashboard/employees/contractors",
          },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.Table,
        url: "/dashboard/payroll/internal",
        items: [],
      },
      {
        title: "Reporting",
        url: "/tables",
        icon: Icons.PieChart,
        items: [],
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
