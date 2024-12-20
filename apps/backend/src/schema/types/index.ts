import { User as UserNamespace } from "./user";
import { Employer as EmployerNamespace } from "./employer";
import { Job as JobNamespace } from "./job";
import { Requirement as RequirementNamespace } from "./requirement";
import { Experience as ExperienceNamespace } from "./experience";
import { Connection as ConnectionNamespace } from "./connection";
import { Education as EducationNamespace } from "./education";
import { JobSeekingStatus as JobSeekingStatusNamespace } from "./jobseeking";
import { Authentication as AuthenticationNamespace } from "./authentication";

// Reexport from different types
export namespace GQLTypes {

  export import User = UserNamespace;

  export import Job = JobNamespace;

  export import Requirement = RequirementNamespace;

  export import Experience = ExperienceNamespace;

  export import Authentication = AuthenticationNamespace;

  export import Employer = EmployerNamespace;

  export import Connection = ConnectionNamespace;

  export import Education = EducationNamespace;

  export import JobSeekingStatus = JobSeekingStatusNamespace;
}
