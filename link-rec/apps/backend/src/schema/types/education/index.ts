import { EducationInputType, EducationType } from "./types";

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

  export const queries = {};

  export const mutations = {};
}
