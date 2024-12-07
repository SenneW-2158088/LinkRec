import { User as UserNamespace } from "./user";
import { Job as JobNamespace } from "./job";
import { Requirement as RequirementNamespace } from "./requirement";
import { Experience as ExperienceNamespace } from "./experience";
import { Authentication as AuthenticationNamespace } from "./authentication";
import { Employer as EmployerNamespace } from "./employer";

// Reexport from different types
export namespace GQLTypes {

  export import User = UserNamespace;

  export import Job = JobNamespace;

  export import Requirement = RequirementNamespace;

  export import Experience = ExperienceNamespace;

  export import Authentication = AuthenticationNamespace;

  export import Employer = EmployerNamespace;

}
