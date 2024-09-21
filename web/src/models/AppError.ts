export default class AppError extends Error {
  constructor(public err: unknown) {
    super("An AppError has occurred");
  }
}
