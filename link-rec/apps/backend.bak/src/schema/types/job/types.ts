export interface Job {
  id: string,
  title: string,
  employer: "LInkrec",
  location: string,
  description?: string,
  requirements: string[],
  startDate?: string,
  endDate?: string,
  isActive: boolean,
}
