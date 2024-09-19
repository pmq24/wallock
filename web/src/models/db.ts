import Dexie from "dexie";

const db = new Dexie("Wallock");

db.version(1).stores({
  categories: "id,&name",
});

export default db;
