# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Mintlify documentation site** for Dromo, a spreadsheet importer platform. The repository contains technical documentation, API references, guides, and tutorials written in MDX format.

## Development Commands

### Local Development
```bash
# Install Mintlify CLI globally
npm i -g mintlify

# Start development server (run from root directory where docs.json is located)
mintlify dev

# Troubleshooting: Re-install dependencies if dev server won't start
mintlify install
```

### Publishing
- Changes are automatically deployed to production when pushed to the default branch
- The site is configured to auto-deploy via GitHub App integration

## Documentation Architecture

### Core Structure
- **docs.json**: Main configuration file defining navigation, theme, API settings, and redirects
- **welcome.mdx**: Landing page introducing Dromo platform
- **getting-started/**: Framework-specific integration guides (JavaScript, React, Angular, Headless)
- **guides/**: In-depth tutorials for advanced features and use cases
- **reference/**: Technical reference documentation for SDKs, APIs, and configuration options
- **api-reference/**: OpenAPI specification and authentication documentation

### Content Organization
The documentation follows a three-tier structure:
1. **Getting Started**: Quick implementation guides for different frameworks
2. **Guides**: Task-oriented tutorials covering specific features like validation, styling, and integrations
3. **Reference**: Complete technical specifications for all APIs, SDKs, and configuration options

### Key Content Areas
- **Schema Management**: Documentation for defining import schemas programmatically or via the Schema Builder
- **Validation System**: Complex validation rules, row hooks, column hooks, and data transformation
- **Integration Patterns**: Framework-specific implementations and customization options
- **API Documentation**: Complete REST API reference with OpenAPI specification

## File Conventions

### MDX Files
- All documentation content uses MDX format with frontmatter
- Frontmatter includes `title` and `icon` fields
- Uses Mintlify-specific components: `<Card>`, `<CardGroup>`, `<Steps>`, `<Step>`, `<Note>`, `<CodeGroup>`
- Code examples are language-tagged for proper syntax highlighting

### Navigation Structure
- Navigation is defined in docs.json under the `navigation.tabs` array
- Uses nested group structure for logical content organization
- Supports both internal pages and external links
- Includes automatic redirects for legacy URLs

### Assets and Images
- Images stored in `/images/` directory with subdirectories for organization
- Uses relative paths from the document root
- Supports both light and dark mode logos

## Common Tasks

### Adding New Documentation
1. Create MDX file in appropriate directory (getting-started/, guides/, or reference/)
2. Add frontmatter with title and icon
3. Update docs.json navigation structure to include the new page
4. Test locally with `mintlify dev`

### Updating API Documentation
- OpenAPI specification is stored in `api-reference/openapi.json`
- API endpoints are auto-generated from the OpenAPI spec
- Authentication documentation is in `api-reference/authentication.mdx`

### Content Guidelines
- Use Mintlify components for consistent styling
- Include code examples with proper language tags
- Add interactive elements where appropriate (Cards, Steps)
- Maintain consistent tone matching existing documentation
- Reference external resources (dashboard, demo, community) using configured URLs

## Configuration Details

### Theme and Branding
- Uses "maple" theme with custom color scheme (primary: #2563EB)
- Configured topbar links to Dashboard and Demo
- "Book Demo" CTA button in topbar that opens Calendly popup widget
- Footer includes social links and community resources
- Custom logo configuration for light/dark modes

### API Integration
- Base URL: https://app.dromo.io/api/v1
- Uses Bearer token authentication with custom header name
- API playground enabled in "show" mode with simple display

### External Resources
- Dashboard: https://dashboard.dromo.io
- Demo: https://demo.dromo.io
- Community: https://discord.gg/dromo
- Changelog: https://changelog.dromo.io
