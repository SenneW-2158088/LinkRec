import { User as UserNamespace } from "./user";
import { Job as JobNamespace } from "./job";

// Reexport from different types
export namespace GQLTypes {

  export import User = UserNamespace;

  export import Job = JobNamespace;


}
