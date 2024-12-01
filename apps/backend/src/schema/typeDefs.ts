
export const typeDefs = gql`
  "Timestamps are represented as ISO-8601 strings"
  scalar DateTime

  type Query {
    "Get the currently authenticated user"
    me: User
    "Get a user by their ID"
    user(id: ID!): User
    "Search for users by name or other criteria"
    searchUsers(query: String!, limit: Int = 10): [User!]!
    "Get job vacancies matching the current user's profile"
    matchingVacancies: [JobVacancy!]!
    "Get all active job vacancies"
    activeVacancies(limit: Int = 10, offset: Int = 0): [JobVacancy!]!
    "Get pending connection requests"
    pendingConnections: [ConnectionRequest!]!
  }

  type Mutation {
    "Create or update user profile"
    updateProfile(input: ProfileInput!): User!
    "Create a new job vacancy"
    createVacancy(input: JobVacancyInput!): JobVacancy!
    "Update an existing job vacancy"
    updateVacancy(id: ID!, input: JobVacancyInput!): JobVacancy!
    "Cancel a job vacancy"
    cancelVacancy(id: ID!): JobVacancy!
    "Request a connection with another user"
    requestConnection(userId: ID!): ConnectionRequest!
    "Respond to a connection request"
    respondToConnection(requestId: ID!, accept: Boolean!): ConnectionRequest!
    "Remove a connection"
    removeConnection(userId: ID!): Boolean!
    "Register a new user"
    register(input: RegisterInput!): AuthPayload!
    "Login user"
    login(email: String!, password: String!): AuthPayload!
  }

  type User {
    id: ID!
    email: String!
    profile: Profile!
    connections: [User!]!
    pendingConnections: [ConnectionRequest!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Profile {
    "Personal Information"
    firstName: String!
    lastName: String!
    headline: String
    phoneNumber: String
    website: String
    location: Location!
    bio: String

    "Professional Information"
    education: [Education!]!
    experience: [Experience!]!
    skills: [String!]!
    languages: [Language!]!

    "Job Preferences"
    isOpenToWork: Boolean!
    desiredJobTypes: [JobType!]
    desiredLocations: [Location!]
    desiredSalaryRange: SalaryRange
  }

  type Location {
    city: String!
    country: String!
    latitude: Float
    longitude: Float
  }

  type Education {
    institution: String!
    degree: String!
    field: String!
    startDate: DateTime!
    endDate: DateTime
    description: String
  }

  type Experience {
    company: String!
    title: String!
    location: Location!
    startDate: DateTime!
    endDate: DateTime
    current: Boolean!
    description: String
    skills: [String!]!
  }

  type Language {
    language: String!
    proficiency: LanguageProficiency!
  }

  type JobVacancy {
    id: ID!
    title: String!
    company: Company!
    description: String!
    requirements: [String!]!
    responsibilities: [String!]!
    jobType: JobType!
    location: Location!
    salaryRange: SalaryRange
    skills: [String!]!
    startDate: DateTime!
    endDate: DateTime!
    status: VacancyStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Company {
    id: ID!
    name: String!
    description: String
    website: String
    location: Location!
    industry: String!
  }

  type ConnectionRequest {
    id: ID!
    from: User!
    to: User!
    status: ConnectionStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type SalaryRange {
    min: Float!
    max: Float!
    currency: String!
  }

  enum JobType {
    FULL_TIME
    PART_TIME
    CONTRACT
    FREELANCE
    INTERNSHIP
  }

  enum LanguageProficiency {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    NATIVE
  }

  enum VacancyStatus {
    ACTIVE
    CLOSED
    CANCELLED
  }

  enum ConnectionStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  input ProfileInput {
    firstName: String
    lastName: String
    headline: String
    phoneNumber: String
    website: String
    location: LocationInput
    bio: String
    education: [EducationInput!]
    experience: [ExperienceInput!]
    skills: [String!]
    languages: [LanguageInput!]
    isOpenToWork: Boolean
    desiredJobTypes: [JobType!]
    desiredLocations: [LocationInput!]
    desiredSalaryRange: SalaryRangeInput
  }

  input LocationInput {
    city: String!
    country: String!
    latitude: Float
    longitude: Float
  }

  input EducationInput {
    institution: String!
    degree: String!
    field: String!
    startDate: DateTime!
    endDate: DateTime
    description: String
  }

  input ExperienceInput {
    company: String!
    title: String!
    location: LocationInput!
    startDate: DateTime!
    endDate: DateTime
    current: Boolean!
    description: String
    skills: [String!]!
  }

  input LanguageInput {
    language: String!
    proficiency: LanguageProficiency!
  }

  input JobVacancyInput {
    title: String!
    description: String!
    requirements: [String!]!
    responsibilities: [String!]!
    jobType: JobType!
    location: LocationInput!
    salaryRange: SalaryRangeInput
    skills: [String!]!
    startDate: DateTime!
    endDate: DateTime!
  }

  input SalaryRangeInput {
    min: Float!
    max: Float!
    currency: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    location: LocationInput!
  }
`;
