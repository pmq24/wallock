import { describe, expect, it, beforeEach } from "vitest";
import { IDBKeyRange, IDBFactory } from "fake-indexeddb";
import { ZodError } from "zod";

import Db from "~/models/Db";
import CategoryService from "../CategoryService";
import Category from "../Category";
import Dexie from "dexie";

const name = "Electricity Bills";
const type = "Expense";

describe("CategoryRepository", async () => {
  let subject: CategoryService;

  beforeEach(() => {
    const db = new Db({ opts: { indexedDB: new IDBFactory(), IDBKeyRange } });
    subject = new CategoryService({ db });
  });

  describe(".create", async () => {
    describe("name arg", async () => {
      describe("is a valid string", async () => {
        it("returns Category", async () => {
          const [err, category] = await subject.create({ name, type });

          expect(err).toBeUndefined();
          expect(category).toBeInstanceOf(Category);
        });
      });

      describe("when: contains newline", async () => {
        it("returns ZodError", async () => {
          const [err, category] = await subject.create({
            name: "Electricity\nBills",
            type,
          });

          expect(category).toBeUndefined();
          expect(err).toBeInstanceOf(ZodError);
        });
      });

      describe("when: already exists", async () => {
        it(`returns Dexie.ConstraintError`, async () => {
          let err, category;

          [err, category] = await subject.create({ name, type });

          if (err) {
            expect.fail("Failed to set up");
          }

          [err, category] = await subject.create({ name, type });

          expect(err).toBeInstanceOf(Dexie.ConstraintError);
          expect(category).toBeUndefined();
        });
      });
    });

    describe("type arg", async () => {
      describe("when: is valid", async () => {
        it("returns created Category instance", async () => {
          const [err, category] = await subject.create({ name, type });

          expect(err).toBeUndefined();
          expect(category).toBeInstanceOf(Category);
        });
      });

      describe("when: is invalid", async () => {
        it(`returns ZodError`, async () => {
          const [err, category] = await subject.create({
            name,
            type: "asdf" as any,
          });

          expect(err).toBeInstanceOf(ZodError);
          expect(category).toBeUndefined();
        });
      });
    });
  });
});
