export const UserRoles = ["job_seeker", "entrepreneur", "company", "admin"] as const;
export type UserRole = (typeof UserRoles)[number];

export const JobOfferStatuses = ["draft", "published", "closed"] as const;
export type JobOfferStatus = (typeof JobOfferStatuses)[number];

export const ApplicationStatuses = ["sent", "viewed", "interview", "accepted", "rejected"] as const;
export type ApplicationStatus = (typeof ApplicationStatuses)[number];

export const ProjectStatuses = [
  "submitted",
  "under_review",
  "accepted",
  "mentoring",
  "funded",
  "rejected"
] as const;
export type ProjectStatus = (typeof ProjectStatuses)[number];

export const FormationTypes = ["employability", "entrepreneurship"] as const;
export type FormationType = (typeof FormationTypes)[number];

export const FormationRegistrationStatuses = ["pending", "confirmed", "cancelled"] as const;
export type FormationRegistrationStatus = (typeof FormationRegistrationStatuses)[number];
