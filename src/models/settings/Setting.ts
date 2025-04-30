import TIME_ZONES from "./consts/TIME_ZONES";

class Setting {
  static TIME_ZONES = TIME_ZONES;
}

namespace Setting {
  export type TimeZone = (typeof TIME_ZONES)[number];
}

export default Setting;
