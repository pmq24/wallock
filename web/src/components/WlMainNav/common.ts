import type { Component } from 'vue'

export type NavItem = {
  name: string;
  label: string;
  icons: {
    active: Component;
    inactive: Component;
  };
}
