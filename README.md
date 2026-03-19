# GTM Tracker

Personal go-to-market progress tracker with web dashboard and MCP integration for Claude.

## Setup

1. Clone: `git clone https://github.com/Chhayly-and-AI/gtm-tracker.git`
2. Install: `npm install`
3. Set up `.env.local` from `.env.local.example`
4. Run DB setup: `psql $DATABASE_URL -f db/setup.sql`
5. Run: `npm run dev`
6. Open: http://localhost:3000

## MCP Setup (Claude Code)

Add to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "gtm-tracker": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/gtm-tracker/mcp/server.ts"],
      "env": {
        "DATABASE_URL": "your-neon-connection-string"
      }
    }
  }
}
```

Then in Claude Code: "Log that I sent 5 DMs today" or "Add a new lead: John from CoffeeShop.com"
