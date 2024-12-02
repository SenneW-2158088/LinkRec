import axios, { Axios } from "axios";
import { Formula, parse } from "rdflib";
// import { Parser } from "sparqljs";

console.log("hello friend");

class FuzzAPI {
  readonly _base: Axios;

  constructor() {
    this._base = axios.create({
      baseURL: "http://localhost:3030",
      headers: { "Content-Type": "application/json" },
    });
  }

  get() {
    this._base
      .get("/linkrec/")
      .then((data) => {
        // let parsed = parse(data.data, new Formula(), "");
        console.log(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const api = new FuzzAPI();

api.get();
