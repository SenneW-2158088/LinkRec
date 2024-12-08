import { EducationInputType, EducationType, EducationUpdateType } from "./types";

export namespace Education {

  export enum DegreeType {
    MASTER,
    BACHELOR,
  };

  export interface Type {
    id: string;
    institution: string;
    title: string;
    degree: DegreeType;
  };

  export const Degree = DegreeType;

  export const Education = EducationType;

  export const Create = EducationInputType;

  export const Update = EducationUpdateType;

  export const queries = {};

  export const mutations = {};
}
