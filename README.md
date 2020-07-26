# Apple Archer Leaderboards

## Updating a score

Make a `post` request to `/api/scores` with headers `Content-Type: application/json` and `x-api-key: {{insert_api_key_here}}`. The body should look like:
```
{
	"name": {{insert name string value here}},
	"score": {{insert score integer value here}}
}
```