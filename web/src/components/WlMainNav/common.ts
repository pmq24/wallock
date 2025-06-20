import type { PageName } from 'pages/router'
import type { Component } from 'vue'

export type NavItem = {
  name: PageName;
  label: string;
  icons: {
    active: Component;
    inactive: Component;
  };
}
