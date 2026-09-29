import { ExternalLink, Plug, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useCrmStore } from '@/domains/crm/crm.store'

const MARKS: Record<string, string> = {
  Gmail: 'M',
  'Google Calendar': '31',
  Slack: 'S',
  Zoom: 'Z',
  Stripe: 'St',
  Zapier: '_',
}

export function IntegrationsView() {
  const integrations = useCrmStore((state) => state.integrations)
  const toggleIntegration = useCrmStore((state) => state.toggleIntegration)
  const connected = integrations.filter((integration) => integration.connected)

  return (
    <section className="view" data-active="true">
      <div className="view-header">
        <div>
          <div className="view-title">Integrations</div>
          <div className="view-sub">Connect the tools your team already uses</div>
        </div>
        <div className="view-actions">
          <span className="cell-sub">
            {connected.length} of {integrations.length} connected
          </span>
        </div>
      </div>

      <div className="simple-card-grid">
        {integrations.map((integration) => (
          <div className="tool-card" key={integration.id}>
            <div className="tool-card-top">
              <div
                className="tool-icon"
                style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em' }}
              >
                {MARKS[integration.name] ?? <Plug style={{ width: 17, height: 17 }} />}
              </div>
              <h4>{integration.name}</h4>
              <span className={integration.connected ? 'status-pill status-active' : 'status-pill status-inactive'}>
                {integration.connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <p>{integration.desc}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                type="button"
                className={integration.connected ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-sm'}
                onClick={() => {
                  toggleIntegration(integration.id)
                  toast.success(
                    integration.connected
                      ? `${integration.name} disconnected`
                      : `${integration.name} connected`,
                  )
                }}
              >
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
              {integration.connected ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => toast(`${integration.name} settings opened`)}
                >
                  <ExternalLink />
                  Settings
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <div className="panel-title">
            Need something else?
            <small>Build your own connection with the NEXA API</small>
          </div>
          <button className="btn btn-ghost" onClick={() => toast('API key copied')}>
            <Zap />
            Get API key
          </button>
        </div>
      </div>
    </section>
  )
}
