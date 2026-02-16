import * as v from 'valibot'

v.setSpecificMessage(
  v.minLength,
  (issue) =>
    issue.requirement === 1 ? 'Required' : `At least ${issue.requirement} characters required`,
  'en',
)
v.setSpecificMessage(v.values, 'Invalid', 'en')
