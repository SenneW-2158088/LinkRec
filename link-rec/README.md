# LinkRec

## Run the backend

```sh
docker-compose up backend-dev -D
```
If some changes don't seem to take place add the `--build` flag to the previous command.

For the production backend you can use `backend-prod` instead.


## Todo
Updates:
```
DELETE {
   ?id ex:description "One old value" .
 }
INSERT {
   ?id ex:description "My new description" .
}
WHERE {
   ?id ex:description "One old value" .
}
```

- query All jobs
- update rdf user
- user/employer update password
- insert/delete job
- matching algorithm -> find all employees + find all matchings jobs
  - User has matchingRequirements
  - Find all jobs that contain matchingRequirements
- send/accept/remove connections:
  - send: user1 knows user2
  - infer connection status
  - accept: user2 knows user1
  - remove: user1 doesn't know user2
- add/update rdf employer data
- add roles + RBA to some routes
