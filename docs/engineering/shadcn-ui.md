# shadcn/ui Agent Reference

> shadcn/ui is a collection of beautifully-designed, accessible components and a code distribution platform. It is built with TypeScript, Tailwind CSS, and Radix UI primitives. It supports multiple frameworks including Next.js, Vite, Remix, Astro, and more. Open Source. Open Code. AI-Ready. It also comes with a command-line tool to install and manage components and a registry system to publish and distribute code.

## Agent Guidance

- Read the [Skills](https://ui.shadcn.com/docs/skills) documentation when working on shadcn/ui components with an AI assistant.
- Use the [MCP Server](https://ui.shadcn.com/docs/mcp) when the configured assistant supports browsing, searching, or installing components from shadcn registries.
- Treat installed shadcn components as application-owned source code. Inspect and adapt them to the project rather than assuming they are opaque package APIs.
- Reuse existing components and primitives before creating new ones.
- Keep business rules and data-fetching logic outside presentational shadcn components.
- Preserve accessibility behavior, keyboard navigation, focus states, and responsive behavior.
- Use the repository's existing `cn()` utility, aliases, styling conventions, and component variants.
- Check `components.json` before installing or generating components. It defines the CLI configuration, aliases, styling, and component paths.
- Avoid replacing local component customizations by rerunning installation commands without inspecting the resulting diff.

## Overview

- [Introduction](https://ui.shadcn.com/docs): Core principles: Open Code, Composition, Distribution, Beautiful Defaults, and AI-Ready design.
- [CLI](https://ui.shadcn.com/docs/cli): Command-line tool for installing and managing components.
- [components.json](https://ui.shadcn.com/docs/components-json): Configuration file for customizing the CLI and component installation.
- [Theming](https://ui.shadcn.com/docs/theming): Guide to customizing colors, typography, and design tokens.
- [Typeset](https://ui.shadcn.com/docs/typeset): Typography for rendered markdown, from blog posts to streaming chat.
- [Changelog](https://ui.shadcn.com/docs/changelog): Release notes and version history.
- [Skills](https://ui.shadcn.com/docs/skills): Deep shadcn/ui knowledge for AI assistants such as Claude Code.
- [Directory](https://ui.shadcn.com/docs/directory): Community registries built into the CLI.

## Installation

- [Next.js](https://ui.shadcn.com/docs/installation/next)
- [Vite](https://ui.shadcn.com/docs/installation/vite)
- [Remix](https://ui.shadcn.com/docs/installation/remix)
- [Astro](https://ui.shadcn.com/docs/installation/astro)
- [Laravel](https://ui.shadcn.com/docs/installation/laravel)
- [Gatsby](https://ui.shadcn.com/docs/installation/gatsby)
- [React Router](https://ui.shadcn.com/docs/installation/react-router)
- [TanStack Router](https://ui.shadcn.com/docs/installation/tanstack-router)
- [TanStack Start](https://ui.shadcn.com/docs/installation/tanstack)
- [Manual Installation](https://ui.shadcn.com/docs/installation/manual)

## Components

### Form and Input

- [Field](https://ui.shadcn.com/docs/components/field)
- [Button](https://ui.shadcn.com/docs/components/button)
- [Button Group](https://ui.shadcn.com/docs/components/button-group)
- [Input](https://ui.shadcn.com/docs/components/input)
- [Input Group](https://ui.shadcn.com/docs/components/input-group)
- [Input OTP](https://ui.shadcn.com/docs/components/input-otp)
- [Textarea](https://ui.shadcn.com/docs/components/textarea)
- [Checkbox](https://ui.shadcn.com/docs/components/checkbox)
- [Radio Group](https://ui.shadcn.com/docs/components/radio-group)
- [Select](https://ui.shadcn.com/docs/components/select)
- [Native Select](https://ui.shadcn.com/docs/components/native-select)
- [Switch](https://ui.shadcn.com/docs/components/switch)
- [Slider](https://ui.shadcn.com/docs/components/slider)
- [Calendar](https://ui.shadcn.com/docs/components/calendar)
- [Date Picker](https://ui.shadcn.com/docs/components/date-picker)
- [Combobox](https://ui.shadcn.com/docs/components/combobox)
- [Label](https://ui.shadcn.com/docs/components/label)

### Layout and Navigation

- [Accordion](https://ui.shadcn.com/docs/components/accordion)
- [Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb)
- [Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu)
- [Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [Tabs](https://ui.shadcn.com/docs/components/tabs)
- [Separator](https://ui.shadcn.com/docs/components/separator)
- [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area)
- [Resizable](https://ui.shadcn.com/docs/components/resizable)

### Overlays and Dialogs

- [Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog)
- [Sheet](https://ui.shadcn.com/docs/components/sheet)
- [Drawer](https://ui.shadcn.com/docs/components/drawer)
- [Popover](https://ui.shadcn.com/docs/components/popover)
- [Tooltip](https://ui.shadcn.com/docs/components/tooltip)
- [Hover Card](https://ui.shadcn.com/docs/components/hover-card)
- [Context Menu](https://ui.shadcn.com/docs/components/context-menu)
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [Menubar](https://ui.shadcn.com/docs/components/menubar)
- [Command](https://ui.shadcn.com/docs/components/command)

### Feedback and Status

- [Alert](https://ui.shadcn.com/docs/components/alert)
- [Toast](https://ui.shadcn.com/docs/components/toast)
- [Sonner](https://ui.shadcn.com/docs/components/sonner)
- [Progress](https://ui.shadcn.com/docs/components/progress)
- [Spinner](https://ui.shadcn.com/docs/components/spinner)
- [Skeleton](https://ui.shadcn.com/docs/components/skeleton)
- [Badge](https://ui.shadcn.com/docs/components/badge)
- [Empty](https://ui.shadcn.com/docs/components/empty)

### Display and Media

- [Avatar](https://ui.shadcn.com/docs/components/avatar)
- [Card](https://ui.shadcn.com/docs/components/card)
- [Table](https://ui.shadcn.com/docs/components/table)
- [Data Table](https://ui.shadcn.com/docs/components/data-table)
- [Chart](https://ui.shadcn.com/docs/components/chart)
- [Carousel](https://ui.shadcn.com/docs/components/carousel)
- [Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio)
- [Typography](https://ui.shadcn.com/docs/components/typography)
- [Item](https://ui.shadcn.com/docs/components/item)
- [Kbd](https://ui.shadcn.com/docs/components/kbd)

### Miscellaneous

- [Collapsible](https://ui.shadcn.com/docs/components/collapsible)
- [Toggle](https://ui.shadcn.com/docs/components/toggle)
- [Toggle Group](https://ui.shadcn.com/docs/components/toggle-group)
- [Pagination](https://ui.shadcn.com/docs/components/pagination)
- [Direction](https://ui.shadcn.com/docs/components/direction)

## Dark Mode

- [Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [Dark Mode - Next.js](https://ui.shadcn.com/docs/dark-mode/next)
- [Dark Mode - Vite](https://ui.shadcn.com/docs/dark-mode/vite)
- [Dark Mode - Astro](https://ui.shadcn.com/docs/dark-mode/astro)
- [Dark Mode - Remix](https://ui.shadcn.com/docs/dark-mode/remix)

## RTL

- [RTL](https://ui.shadcn.com/docs/rtl)
- [RTL - Next.js](https://ui.shadcn.com/docs/rtl/next)
- [RTL - Vite](https://ui.shadcn.com/docs/rtl/vite)
- [RTL - TanStack Start](https://ui.shadcn.com/docs/rtl/start)

## Forms

- [Forms Overview](https://ui.shadcn.com/docs/forms)
- [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form)
- [TanStack Form](https://ui.shadcn.com/docs/forms/tanstack-form)
- [Formisch](https://ui.shadcn.com/docs/forms/formisch)
- [Forms - Next.js](https://ui.shadcn.com/docs/forms/next)

## Advanced

- [Monorepo](https://ui.shadcn.com/docs/monorepo)
- [React 19](https://ui.shadcn.com/docs/react-19)
- [Tailwind CSS v4](https://ui.shadcn.com/docs/tailwind-v4)
- [JavaScript](https://ui.shadcn.com/docs/javascript)
- [Figma](https://ui.shadcn.com/docs/figma)
- [v0](https://ui.shadcn.com/docs/v0)

## MCP Server

- [MCP Server](https://ui.shadcn.com/docs/mcp): Allows AI assistants to browse, search, and install components from registries using natural language. It supports Claude Code, Cursor, VS Code with GitHub Copilot, Codex, and other clients.

## Registry

- [Registry Overview](https://ui.shadcn.com/docs/registry)
- [Getting Started](https://ui.shadcn.com/docs/registry/getting-started)
- [Examples](https://ui.shadcn.com/docs/registry/examples)
- [FAQ](https://ui.shadcn.com/docs/registry/faq)
- [Authentication](https://ui.shadcn.com/docs/registry/authentication)
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [Add a Registry](https://ui.shadcn.com/docs/registry/registry-index)
- [Open in v0](https://ui.shadcn.com/docs/registry/open-in-v0)
- [registry.json](https://ui.shadcn.com/docs/registry/registry-json)
- [registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json)

### Registry Schemas

- [Registry Schema](https://ui.shadcn.com/schema/registry.json): JSON Schema for registry index files.
- [Registry Item Schema](https://ui.shadcn.com/schema/registry-item.json): JSON Schema for individual registry items.
