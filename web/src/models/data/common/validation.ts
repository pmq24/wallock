import * as valibot from 'valibot';

type ValibotBaseSchema = valibot.BaseSchema<unknown, unknown, valibot.BaseIssue<unknown>>;
export async function validateWithValibot<const TSchema extends ValibotBaseSchema>(schema: TSchema, input: unknown): Promise<valibot.FlatErrors<TSchema> | undefined> {
	const validation = valibot.safeParse(schema, input)

	if (!validation.success) {
		const errors = valibot.flatten(validation.issues)
		return errors
	}

	return
}
