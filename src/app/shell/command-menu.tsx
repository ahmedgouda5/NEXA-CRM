import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building,
  Command,
  CornerDownLeft,
  Kanban,
  Target,
  User,
  Users,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/shared/ui/command'
import { useCrmStore } from '@/domains/crm/crm.store'
import { NAV_GROUPS, useNavigationStore } from '@/domains/navigation'
import { initials, colorFor } from '@/shared/lib/format'

export function CommandMenu() {
  const navigate = useNavigate()
  const open = useNavigationStore((state) => state.commandOpen)
  const setOpen = useNavigationStore((state) => state.setCommandOpen)
  const openCreate = useCrmStore((state) => state.openCreate)
  const openContact = useCrmStore((state) => state.openContact)
  const openDeal = useCrmStore((state) => state.openDeal)
  const contacts = useCrmStore((state) => state.contacts)
  const companies = useCrmStore((state) => state.companies)
  const deals = useCrmStore((state) => state.deals)

  const pages = useMemo(() => NAV_GROUPS.flatMap((group) => group.items), [])

  function run(action: () => void) {
    setOpen(false)
    action()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search contacts, companies, deals or jump to a page"
      className="sm:max-w-xl"
    >
      <CommandInput placeholder="Search contacts, companies, deals, or jump to a page…" />
      <CommandList className="max-h-[380px]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Create">
          <CommandItem
            onSelect={() => run(() => openCreate('contact'))}
            value="create contact"
            keywords={['new', 'add', 'person']}
          >
            <User />
            New contact
            <CommandShortcut>
              <CornerDownLeft style={{ width: 11, height: 11 }} />
            </CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => openCreate('deal'))}
            value="create deal"
            keywords={['new', 'add', 'opportunity']}
          >
            <Kanban />
            New deal
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => openCreate('company'))}
            value="create company"
            keywords={['new', 'add', 'account']}
          >
            <Building />
            New company
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => openCreate('lead'))}
            value="create lead"
            keywords={['new', 'add', 'prospect']}
          >
            <Target />
            New lead
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => openCreate('task'))}
            value="create task"
            keywords={['new', 'add', 'todo']}
          >
            <Command style={{ width: 15, height: 15 }} />
            New task
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Go to">
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <CommandItem
                key={page.id}
                value={`go ${page.label}`}
                onSelect={() => run(() => navigate(page.path))}
              >
                <Icon />
                {page.label}
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Contacts">
          {contacts.slice(0, 6).map((contact) => (
            <CommandItem
              key={contact.id}
              value={`contact ${contact.name} ${contact.company} ${contact.email}`}
              onSelect={() => run(() => openContact(contact.id))}
            >
              <Dot name={contact.name} />
              {contact.name}
              <span className="text-[11px] text-text-dim">{contact.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Companies">
          {companies.map((company) => (
            <CommandItem
              key={company.id}
              value={`company ${company.name} ${company.industry}`}
              onSelect={() => run(() => navigate('/companies'))}
            >
              <Dot name={company.name} />
              {company.name}
              <span className="text-[11px] text-text-dim">{company.industry}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Deals">
          {deals.slice(0, 6).map((deal) => (
            <CommandItem
              key={deal.id}
              value={`deal ${deal.name} ${deal.company} ${deal.stage}`}
              onSelect={() => run(() => openDeal(deal.id))}
            >
              <Users style={{ width: 15, height: 15 }} />
              {deal.name}
              <span className="text-[11px] text-text-dim">{deal.stage}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

function Dot({ name }: { name: string }) {
  return (
    <span
      className="inline-flex size-[18px] items-center justify-center rounded-[5px] text-[9px] font-bold text-white"
      style={{ background: colorFor(name) }}
    >
      {initials(name).slice(0, 1)}
    </span>
  )
}
