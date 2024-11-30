# Apache Jena Fuseki Lore

## Data loading

Since fuseki is a little bit cursed we need the initialize the data in 2 steps.

**Step 1: Initialize the Fuseki server**

Startup using docker compose:

```sh
docker-compose up fuseki-dev --build
```

Close the server:

```sh
docker-compose down fuseki-dev
```

**Step 2: Load data into the database**
Since fuseki has some limitations regarding sharing databases we need to startup it's own instance to just load the data.
Later this could be changed inside the docker file but this works for now. Keep in mind that as long as you dont delete this container,
the data should stay persistent.

```sh
docker run -v ./fuseki/staging:/staging \
--volumes-from linkrec-fuseki-dev-1 --rm \
-u root:root linkrec-fuseki-dev ./load.sh linkrec
```
