import type { AppDexie } from "models/dexie";
import Setting from "./Setting";
import * as v from "valibot";
import { createStandardError, createStandardSuccess } from "models/common";
import { nanoid } from "nanoid";

class SettingService {
  constructor(private dexie: AppDexie) {}

  async create(data: SettingService.CreateData) {
    const validation = v.safeParse(this.getSchema(), data);

    if (!validation.success) {
      const errors = v.flatten(validation.issues);
      return createStandardError(errors);
    }

    const id = await this.dexie.settings.add({
      id: nanoid(),
      timeZone: validation.output.timeZone as Setting.TimeZone,
    });

    return createStandardSuccess(id);
  }

  private getSchema() {
    return v.object(
      {
        timeZone: v.pipe(
          v.string(),
          v.values(Setting.TIME_ZONES, "Invalid time zone"),
        ),
      },
      "Missing details",
    );
  }
}

namespace SettingService {
  export type CreateData = {
    timeZone: Setting.TimeZone;
  };
}

export default SettingService;
