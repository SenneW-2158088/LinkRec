import axios, { Axios } from "axios";
import { Parser } from "sparqljs";

console.log("hello friend");

class FuzzAPI {
  readonly _base: Axios;

  constructor() {
    this._base = axios.create({
      baseURL: "http://localhost:3030",
    });
  }
}

axios
  .get("http://localhost:3030")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
