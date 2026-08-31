# <Module Name>

## What this module does
Plain-English summary. Not code — what it's *for*, in a sentence or two.

## What was built
- Key classes/services/controllers, one line each on their role.
- DB entities/tables touched or added.
- Any business rules worth flagging (validation, edge cases, why a particular approach was chosen over another).

## API Endpoints
For each endpoint:
- `METHOD /path`
- Auth required? What header/token?
- Request body (JSON shape, with field types and which are optional)
- Success response (JSON shape + status code)
- Error responses (status code + shape, for each realistic failure case — validation error, not found, unauthorized, etc.)

## Example request/response
One realistic curl or JSON example per endpoint. Real-looking values, not `foo`/`bar`.

## Frontend implementation notes
This is the most important section — written for someone who has NOT read the backend code:
- What order to call things in, if multi-step (e.g. request OTP → verify OTP → get token).
- What to store client-side and where (e.g. token in memory vs storage) and how long it's valid.
- What loading/error states the UI needs to handle, mapped to the specific error responses above.
- Anything non-obvious: pagination shape, date/number formats, enum values and what they mean, rate limits.

## Open items / not yet implemented
Anything the frontend should know is still pending, so they don't build against something half-finished.
