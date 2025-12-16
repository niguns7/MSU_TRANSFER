import { z } from 'zod';

// Enums matching Prisma schema
export const FormModeEnum = z.enum(['partial', 'full']);
export const StudyLevelEnum = z.enum(['Undergraduate', 'Graduate', 'Associate', 'Certificate', 'Other']);
export const TermSeasonEnum = z.enum(['Spring', 'Summer', 'Fall', 'Other']);
export const CommunicationChannelEnum = z.enum(['Facebook', 'LinkedIn', 'Whatsapp', 'Instagram', 'Twitter', 'Email', 'Phone']);

// Phone number validation (E.164 format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Email validation (RFC 5322 simplified)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation
const urlRegex = /^https?:\/\/.+/;

// Base schema for common fields
const baseSchema = z.object({
  // Step 1: Personal Identity & Contact
  fullName: z.string().min(2, 'Full name is required').max(256, 'Name is too long').trim(),
  email: z.string().email('Invalid email address').regex(emailRegex, 'Invalid email format').max(256).toLowerCase(),
  phone: z.string().min(10, 'Phone number is required').max(20, 'Phone number is too long').trim(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  formDate: z.coerce.date().default(() => new Date()),
  
  // Consent
  consent: z.boolean().default(false),
});

// Partial form schema (minimal required fields)
export const partialFormSchema = baseSchema.extend({
  formMode: z.literal('partial'),
});

// Full form base (without refinements for discriminated union)
const fullFormBase = z.object({
  formMode: z.literal('full'),
  
  // Step 1: Personal Identity & Contact (email optional for full forms)
  fullName: z.string().min(2, 'Full name is required').max(256, 'Name is too long').trim(),
  email: z.string().email('Invalid email address').regex(emailRegex, 'Invalid email format').max(256).toLowerCase().optional().nullable(),
  phone: z.string().min(10, 'Phone number is required').max(20, 'Phone number is too long').trim(),
  dateOfBirth: z.coerce.date()
    .refine((date) => {
      const age = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 15;
    }, 'Must be at least 15 years old'),
  formDate: z.coerce.date().default(() => new Date()),
  
  // Consent
  consent: z.boolean().default(false),
  
  // Step 2: Address
  address: z.string().min(10, 'Complete address is required').max(1024, 'Address is too long').trim(),
  
  // Step 3: Study Level & Prior Education
  studyLevel: StudyLevelEnum,
  previousCollege: z.string().min(2, 'Previous college name is required').max(256).trim(),
  previousCreditHours: z.coerce.number().int().min(0).max(200).optional().nullable(),
  
  // Step 4: Current Enrollment
  currentCollege: z.string().min(2, 'Current college name is required').max(256).trim(),
  currentCreditHours: z.coerce.number().int().min(0, 'Credit hours are required').max(200),
  
  // Step 5: Transfer Destination & Timing
  intendedCollege: z.string().max(256).trim().optional().nullable(),
  plannedCreditHours: z.coerce.number().int().min(0, 'Planned credit hours are required').max(200),
  termYear: z.coerce.number().int()
    .min(new Date().getFullYear(), `Year must be ${new Date().getFullYear()} or later`)
    .max(new Date().getFullYear() + 3, 'Year cannot be more than 3 years in the future'),
  termSeason: TermSeasonEnum,
  
  // Step 6: Major Plan
  major: z.string().min(2, 'Major is required').max(256).trim(),
  switchingMajor: z.boolean(),
  switchMajorDetails: z.string().max(1024).trim().optional().nullable(),
  
  // Step 7: Academics, Tuition & Scholarships
  previousGPA: z.coerce.number().min(0).max(4.0, 'GPA must be between 0.0 and 4.0'),
  expectedGPA: z.coerce.number().min(0).max(4.0, 'GPA must be between 0.0 and 4.0'),
  previousTuition: z.coerce.number().min(0).optional().nullable(),
  currentTuition: z.coerce.number().min(0, 'Current tuition is required'),
  hasScholarship: z.boolean(),
  scholarshipAmount: z.coerce.number().min(0).optional().nullable(),
  payingPerSemester: z.coerce.number().min(0, 'Amount paying per semester is required'),
  
  // Step 8: Motivation & Profile
  transferReason: z.string().min(10, 'Please explain why you are planning to transfer').max(2048).trim(),
  institutionReason: z.string().min(10, 'Please explain why you are choosing this institution').max(2048).trim(),
  extracurriculars: z.string().max(2048).trim().optional().nullable(),
  
  // Step 9: Immigration & Special Circumstances
  immigrationStatus: z.string().min(2, 'Immigration status is required').max(256).trim(),
  specialCircumstances: z.string().min(1, 'Required field (enter "None" if not applicable)').max(2048).trim(),
  
  // Step 10: Referral & Communication
  referredBy: z.string().max(256).trim().optional().nullable(),
  howDidYouKnow: z.string().max(256).trim().optional().nullable(),
  preferredChannelLink: z.string().regex(urlRegex, 'Must be a valid URL').max(512),
  preferredChannel: CommunicationChannelEnum,
});

// Full form schema with refinements
export const fullFormSchema = fullFormBase.refine(
  (data) => {
    // If switching major, details are required
    if (data.switchingMajor && !data.switchMajorDetails) {
      return false;
    }
    return true;
  },
  {
    message: 'Please provide details about your major switch',
    path: ['switchMajorDetails'],
  }
).refine(
  (data) => {
    // If has scholarship, amount is required
    if (data.hasScholarship && (!data.scholarshipAmount || data.scholarshipAmount <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please provide scholarship amount',
    path: ['scholarshipAmount'],
  }
);

// Combined schema that handles both modes (using base without refinements)
export const submissionSchema = z.discriminatedUnion('formMode', [
  partialFormSchema,
  fullFormBase,
]).superRefine((data, ctx) => {
  // Apply full form refinements only for full mode
  if (data.formMode === 'full') {
    // If switching major, details are required
    if (data.switchingMajor && !data.switchMajorDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide details about your major switch',
        path: ['switchMajorDetails'],
      });
    }
    
    // If has scholarship, amount is required
    if (data.hasScholarship && (!data.scholarshipAmount || data.scholarshipAmount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide scholarship amount',
        path: ['scholarshipAmount'],
      });
    }
  }
});

// Type exports
export type PartialFormData = z.infer<typeof partialFormSchema>;
export type FullFormData = z.infer<typeof fullFormSchema>;
export type SubmissionFormData = z.infer<typeof submissionSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// Query schemas for admin API
export const submissionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  formMode: FormModeEnum.optional(),
  termSeason: TermSeasonEnum.optional(),
  termYear: z.coerce.number().int().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
