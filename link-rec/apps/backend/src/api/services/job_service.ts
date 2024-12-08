import { Context } from "..";
import { Database } from "../../db/database";
import { GQLTypes } from "../../schema/types";


type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class JobService{

  constructor(private context: Context) {}


  async create() {

  }

  async update() {

  }

  async delete() {

  }

  async all() {

  }
}
