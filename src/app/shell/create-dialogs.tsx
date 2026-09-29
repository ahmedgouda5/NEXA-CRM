import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ContactForm } from '@/domains/crm/contacts'
import {
  CRM_OWNERS,
  dealFormSchema,
  type ContactFormValues,
  type DealFormValues,
} from '@/domains/crm/contacts/contact.schema'
import { useCrmStore } from '@/domains/crm/crm.store'
import type { LeadSource, TaskPriority } from '@/domains/crm/crm.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

const DEAL_DEFAULTS: DealFormValues = {
  name: '',
  company: 'Acme Corporation',
  value: 12000,
  stage: 'Negotiation',
  prob: 60,
  owner: CRM_OWNERS[0],
}

export function CreateDialogs() {
  const kind = useCrmStore((state) => state.createKind)
  const setKind = useCrmStore((state) => state.openCreate)
  const addContact = useCrmStore((state) => state.addContact)
  const addDeal = useCrmStore((state) => state.addDeal)
  const addCompany = useCrmStore((state) => state.addCompany)
  const addLead = useCrmStore((state) => state.addLead)
  const addTask = useCrmStore((state) => state.addTask)

  return (
    <>
      <Dialog
        open={kind === 'contact'}
        onOpenChange={(open) => {
          if (!open) setKind(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add contact</DialogTitle>
            <DialogDescription>
              Validated with zod — submit empty to see the error states.
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            onSubmit={(values: ContactFormValues) => {
              addContact(values)
              setKind(null)
            }}
            onCancel={() => setKind(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={kind === 'deal'}
        onOpenChange={(open) => {
          if (!open) setKind(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New deal</DialogTitle>
            <DialogDescription>Add an opportunity to the pipeline board.</DialogDescription>
          </DialogHeader>
          <DealForm
            onSubmit={(values) => {
              addDeal(values)
              toast.success(`${values.name} added to the pipeline`)
              setKind(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={kind === 'company'}
        onOpenChange={(open) => {
          if (!open) setKind(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add company</DialogTitle>
            <DialogDescription>Track a new account and its pipeline.</DialogDescription>
          </DialogHeader>
          <SimpleForm
            fields={[
              { name: 'name', label: 'Company', placeholder: 'Acme Corporation' },
              { name: 'industry', label: 'Industry', placeholder: 'Manufacturing' },
            ]}
            select={{
              name: 'owner',
              label: 'Owner',
              options: [...CRM_OWNERS],
            }}
            submitLabel="Add company"
            onSubmit={(values) => {
              addCompany(values as { name: string; industry: string; owner: string })
              toast.success('Company added')
              setKind(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={kind === 'lead'}
        onOpenChange={(open) => {
          if (!open) setKind(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New lead</DialogTitle>
            <DialogDescription>Capture a prospect before they go cold.</DialogDescription>
          </DialogHeader>
          <SimpleForm
            fields={[
              { name: 'name', label: 'Name', placeholder: 'Jordan Reyes' },
              { name: 'company', label: 'Company', placeholder: 'Acme Corporation' },
            ]}
            select={{
              name: 'source',
              label: 'Source',
              options: [
                'Website form',
                'Referral',
                'LinkedIn',
                'Webinar',
                'Cold outreach',
              ] as LeadSource[],
            }}
            submitLabel="Add lead"
            onSubmit={(values) => {
              addLead(values as unknown as { name: string; company: string; source: LeadSource })
              toast.success('Lead added')
              setKind(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={kind === 'task'}
        onOpenChange={(open) => {
          if (!open) setKind(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Keep the commitment on the board.</DialogDescription>
          </DialogHeader>
          <SimpleForm
            fields={[
              { name: 'title', label: 'Task', placeholder: 'Send the proposal' },
              { name: 'company', label: 'Company', placeholder: 'Acme Corporation' },
              { name: 'due', label: 'Due', placeholder: 'Tomorrow, 3:00 PM' },
            ]}
            select={{
              name: 'priority',
              label: 'Priority',
              options: ['High', 'Medium', 'Low'] as TaskPriority[],
            }}
            submitLabel="Create task"
            onSubmit={(values) => {
              addTask(values as unknown as { title: string; company: string; priority: TaskPriority; due: string })
              toast.success('Task created')
              setKind(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

function DealForm({ onSubmit }: { onSubmit: (values: DealFormValues) => void }) {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: DEAL_DEFAULTS,
  })

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      noValidate
    >
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-xs font-semibold text-text-dim">Deal name</span>
        <Input placeholder="Enterprise Platform" {...form.register('name')} />
        {form.formState.errors.name ? (
          <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-text-dim">Company</span>
        <Input placeholder="Acme Corporation" {...form.register('company')} />
        {form.formState.errors.company ? (
          <span className="text-xs text-destructive">{form.formState.errors.company.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-text-dim">Value ($)</span>
        <Input type="number" placeholder="24500" {...form.register('value')} />
        {form.formState.errors.value ? (
          <span className="text-xs text-destructive">{form.formState.errors.value.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-text-dim">Stage</span>
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          {...form.register('stage')}
        >
          <option value="Lead">Lead</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Negotiation">Negotiation</option>
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-text-dim">Probability (%)</span>
        <Input type="number" placeholder="75" {...form.register('prob')} />
        {form.formState.errors.prob ? (
          <span className="text-xs text-destructive">{form.formState.errors.prob.message}</span>
        ) : null}
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-xs font-semibold text-text-dim">Owner</span>
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          {...form.register('owner')}
        >
          {CRM_OWNERS.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
      </label>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="submit">Create deal</Button>
      </div>
    </form>
  )
}

type SimpleField = { name: string; label: string; placeholder: string }

function SimpleForm({
  fields,
  select,
  submitLabel,
  onSubmit,
}: {
  fields: SimpleField[]
  select: { name: string; label: string; options: readonly string[] }
  submitLabel: string
  onSubmit: (values: Record<string, string>) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const field of fields) initial[field.name] = ''
    initial[select.name] = select.options[0] ?? ''
    return initial
  })
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const missing = fields.filter((field) => !values[field.name]?.trim())
        if (missing.length > 0) {
          setError(`${missing[0].label} is required`)
          return
        }
        setError(null)
        onSubmit(values)
      }}
    >
      {fields.map((field) => (
        <label className="grid gap-1.5" key={field.name}>
          <span className="text-xs font-semibold text-text-dim">{field.label}</span>
          <Input
            placeholder={field.placeholder}
            value={values[field.name] ?? ''}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
            }
          />
        </label>
      ))}
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-text-dim">{select.label}</span>
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={values[select.name] ?? ''}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, [select.name]: event.target.value }))
          }
        >
          {select.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
      <div className="flex justify-end gap-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
