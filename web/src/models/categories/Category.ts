import Dexie, { Entity } from "dexie";

export default class Category extends Entity<Dexie> {
  static readonly types = ["Income", "Expense"] as const;

  constructor(
    public readonly editable: boolean,
    public readonly id: string,
    public readonly name: string,
    public readonly type: CategoryType,
  ) {
    super();
  }
}

export type CategoryType = (typeof Category.types)[number];
