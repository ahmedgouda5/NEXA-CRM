import { z } from 'zod'

export const CRM_OWNERS = ['Ahmed Gouda', 'Sarah Johnson', 'Mike Chen'] as const

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  company: z.string().min(2, 'Company is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(6, 'Enter a valid phone number')
    .regex(/^[+\d][\d\s()-]{5,}$/, 'Enter a valid phone number'),
  owner: z.enum(CRM_OWNERS, { message: 'Pick an owner' }),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const contactFormDefaults: ContactFormValues = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  owner: CRM_OWNERS[0],
}

export const dealFormSchema = z.object({
  name: z.string().min(2, 'Deal name is required'),
  company: z.string().min(2, 'Company is required'),
  value: z.coerce.number().positive('Enter a value greater than 0'),
  stage: z.enum(['Lead', 'Qualified', 'Proposal', 'Negotiation'], {
    message: 'Pick a stage',
  }),
  prob: z.coerce.number().min(0, 'Min 0').max(100, 'Max 100'),
  owner: z.enum(CRM_OWNERS, { message: 'Pick an owner' }),
})

export type DealFormValues = z.infer<typeof dealFormSchema>
