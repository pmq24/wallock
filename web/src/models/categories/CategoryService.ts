import Dexie from "dexie";
import { nanoid } from "nanoid";
import { z } from "zod";

import Db from "~/models/Db";
import AppError from "~/models/AppError";
import Category from "./Category";

export default class CategoryService {
  static readonly errors = {
    containsNewline: "contain_newline",
  } as const;

  static readonly createSchema = z
    .object({
      name: z.coerce
        .string()
        .regex(/^.+$/, CategoryService.errors.containsNewline),
      type: z.enum(Category.types),
    })
    .required({ name: true, type: true });

  constructor({ db }: { db: Db }) {
    this.#db = db;
  }

  async create(dto: CategoryCreateDto) {
    const { success, data, error } =
      CategoryService.createSchema.safeParse(dto);

    if (!success) {
      return [error, undefined] as const;
    }

    try {
      const id = await this.#db.categories.add({
        id: nanoid(),
        name: data.name,
        type: data.type,
        editable: true,
      });
      const c = await this.#db.categories.get(id);

      return [undefined, c!] as const;
    } catch (err) {
      if (err instanceof Dexie.ConstraintError) {
        return [err, undefined] as const;
      } else {
        return [new AppError(err), undefined] as const;
      }
    }
  }

  #db: Db;
}

export type CategoryCreateDto = z.infer<typeof CategoryService.createSchema>;
