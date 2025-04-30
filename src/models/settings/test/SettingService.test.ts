import { beforeEach, describe, expect, it } from "vitest";
import SettingService from "../SettingService";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { createAppDexie, type AppDexie } from "models/dexie";

describe("SettingService", () => {
  let dexie: AppDexie;
  let service: SettingService;

  describe("create", () => {
    beforeEach(() => {
      dexie = createAppDexie({ indexedDB: new IDBFactory(), IDBKeyRange });
      service = new SettingService(dexie);
    });

    describe("when data is valid", () => {
      it("creates a setting", async () => {
        const data: any = { timeZone: "UTC" };
        const result = await service.create(data);

        expect(result.success).toBe(true);

        const settingCount = await dexie.settings.count();
        expect(settingCount).toBe(1);

        const setting = (await dexie.settings.toArray()).at(0);
        expect(setting).toBeDefined();
        expect(setting?.timeZone).toBe("UTC");
      });
    });

    describe("when data is not an object", () => {
      it("returns correct error", async () => {
        const data: any = 123;
        const result = await service.create(data);

        expect(result.success).toBe(false);
        expect(result.errors?.root).toContain("Missing details");
      });
    });

    describe("when data.timeZone is in allowed list", () => {
      it("returns correct error", async () => {
        const data: any = { timeZone: "invalid" };
        const result = await service.create(data);
        expect(result.errors?.nested?.timeZone).toContain("Invalid time zone");
      });
    });
  });
});
