import Dexie, { type DexieOptions, type EntityTable } from "dexie";

import Category from "~/models/categories/Category";

type TypedDexie = Dexie & {
  categories: EntityTable<Category, "id">;
};

export default class Db {
  constructor({ opts }: { opts?: DexieOptions }) {
    this.#dexie = new Dexie("Wallock", opts) as TypedDexie;

    this.#dexie.version(1).stores({ categories: "id,&[name+type]" });

    this.#dexie.categories.mapToClass(Category);
  }

  get categories() {
    return this.#dexie.categories;
  }

  #dexie: TypedDexie;
}
