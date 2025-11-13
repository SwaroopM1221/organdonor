# Design Guidelines: Organ & Blood Donor Finder Platform

## Design Approach
**System-Based Approach** - Material Design inspired with medical application modifications
- Rationale: Healthcare platforms require trust, clarity, and quick information scanning. Material Design provides accessible patterns with strong visual feedback, ideal for emergency-use applications.
- Key Principles: Information clarity over decoration, accessibility-first design, fast cognitive processing, trust-building through professionalism

## Typography System

**Font Family**: Inter via Google Fonts CDN
- Primary: Inter (400, 500, 600, 700)

**Hierarchy**:
- Page Headers: text-4xl font-bold (donor lists, search results)
- Section Titles: text-2xl font-semibold (registration form sections)
- Card Headers: text-lg font-semibold (donor cards, map popups)
- Body Text: text-base font-normal (contact details, descriptions)
- Labels: text-sm font-medium (form labels, filter tags)
- Metadata: text-xs font-normal (timestamps, distances)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section spacing: space-y-6 or space-y-8
- Grid gaps: gap-4 or gap-6
- Form field spacing: space-y-4

**Container Strategy**:
- Full-width: Map interface (w-full h-screen)
- Content areas: max-w-7xl mx-auto px-4
- Forms: max-w-2xl mx-auto
- Donor cards: max-w-sm within grid layouts

## Core Components

### 1. Navigation Header
- Sticky top navigation with shadow
- Logo/Brand left-aligned
- Primary actions: "Find Donors" and "Register as Donor" buttons (right-aligned)
- Emergency hotline number displayed prominently
- Mobile: Hamburger menu with full-screen overlay

### 2. Search & Filter Panel
- Fixed sidebar (desktop) or collapsible panel (mobile)
- Range dropdown: Large, easy-to-tap options (1km, 5km, 10km, 25km, 50km)
- Blood type filters: Grid of buttons with clear active states
- Organ type checkboxes with icons from Heroicons
- Availability toggle switch
- "Apply Filters" primary action button

### 3. Interactive Map Interface
- Full-height map container using Leaflet.js or Mapbox GL JS
- Custom donor markers with pulsing animation for live locations
- Popup cards on marker click showing:
  - Donor name (text-lg font-semibold)
  - Blood type badge (rounded-full px-3 py-1)
  - Distance indicator (text-sm with location icon)
  - Contact button (primary CTA)
  - Last active timestamp
- Cluster markers for dense areas with count badges
- User location marker with distinct styling
- Zoom controls (bottom-right corner)

### 4. Donor Registration Form
- Multi-step wizard (3 steps: Personal Info → Medical Details → Contact & Location)
- Progress indicator at top
- Form sections with clear labels and help text
- Required field indicators (asterisk)
- Input fields: Full-width with border, rounded-lg, p-3
- Dropdown selects for blood type and organ preferences
- Phone number input with country code selector
- Location permission request with clear explanation
- Terms acceptance checkbox
- Submit button: Full-width, prominent, with loading state

### 5. Donor Cards (List View Alternative)
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure:
  - Avatar placeholder (w-16 h-16 rounded-full)
  - Donor info stack (name, blood type, compatibility indicator)
  - Distance badge (top-right corner)
  - Contact details (phone icon + number)
  - "View on Map" and "Contact" action buttons
- Hover state: Subtle elevation increase (shadow-lg)

### 6. Contact Modal
- Centered overlay with backdrop blur
- Modal content: max-w-md with rounded-xl
- Contact information prominently displayed
- Call and Message action buttons
- Privacy reminder text
- Close button (top-right)

### 7. Emergency Banner (Optional Top Banner)
- Full-width alert strip above header
- "Active Emergency Request" indicator
- Quick stats: "X donors found within Y km"
- Dismissible (but persistent across session)

## Component Library

**Icons**: Heroicons via CDN (outline for general use, solid for active states)
- Map markers, location pins, phone, heart, droplet (blood), user, filter, search

**Buttons**:
- Primary: Rounded-lg, px-6, py-3, font-medium with subtle shadow
- Secondary: Outlined style, same padding
- Icon buttons: p-2, rounded-full for map controls
- Hover: Transform scale-105 transition

**Form Elements**:
- Inputs: border, rounded-lg, p-3, focus ring with offset
- Dropdowns: Custom styled with chevron icon
- Checkboxes/Radio: Custom styled with check icon
- Toggle switches: Rounded-full track with sliding circle

**Cards**:
- Rounded-xl with border
- Padding: p-6
- Shadow: shadow-sm default, shadow-md on hover
- Transition: all duration-200

**Badges**:
- Rounded-full, px-3, py-1, text-xs font-medium
- Different styles for blood types, status indicators

## Images

**Hero Section**: Yes - Include impactful medical imagery
- Image: Compassionate healthcare worker or diverse donors in medical setting
- Placement: Full-width hero (h-96 lg:h-[500px]) with overlay gradient
- Content overlay: Centered headline + search CTA with blurred background (backdrop-blur-sm bg-white/90)

**Registration Page**: Supportive imagery
- Small header image (h-48) showing community/helping hands
- Purpose: Build trust and emotional connection

## Accessibility Implementation
- ARIA labels on all interactive elements
- Keyboard navigation throughout (focus indicators visible)
- Screen reader announcements for map marker updates
- Color contrast ratios meeting WCAG AA standards minimum
- Form validation with clear error messages
- Skip navigation links for keyboard users
- Alt text for all images and icons

## Animations
Use sparingly for functional feedback only:
- Pulsing animation on live location markers (subtle, 2s duration)
- Loading spinners during data fetch
- Smooth map pan/zoom transitions
- Form field focus transitions (200ms)
- Modal entrance/exit (fade + slide, 300ms)

Avoid decorative animations - prioritize speed and clarity in emergency scenarios.