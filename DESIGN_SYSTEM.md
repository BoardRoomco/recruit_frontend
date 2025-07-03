# Recruitment Platform Design System

## Overview
This document outlines the new design system for the recruitment platform, based on a modern, clean, and professional aesthetic that emphasizes clarity, hierarchy, and user experience.

## Design Philosophy
- **Clean & Modern**: Minimalist approach with plenty of white space
- **Professional**: Corporate-friendly design suitable for recruitment
- **Accessible**: High contrast and clear typography
- **Responsive**: Mobile-first design approach
- **Consistent**: Unified component system across all pages

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` (blue-600) - Main brand color, buttons, links
- **Primary Blue Hover**: `#1d4ed8` (blue-700) - Button hover states
- **Primary Blue Light**: `#dbeafe` (blue-100) - Backgrounds, highlights

### Neutral Colors
- **White**: `#ffffff` - Primary background
- **Gray 50**: `#f9fafb` - Page background
- **Gray 100**: `#f3f4f6` - Card backgrounds, subtle backgrounds
- **Gray 200**: `#e5e7eb` - Borders, dividers
- **Gray 400**: `#9ca3af` - Icons, secondary text
- **Gray 500**: `#6b7280` - Muted text
- **Gray 600**: `#4b5563` - Body text
- **Gray 900**: `#111827` - Headings, primary text

### Status Colors
- **Success Green**: `#16a34a` (green-600) - Success states, positive actions
- **Warning Orange**: `#ea580c` (orange-600) - Warnings, areas for improvement
- **Error Red**: `#dc2626` (red-600) - Errors, destructive actions
- **Info Blue**: `#2563eb` (blue-600) - Information, neutral actions

## Typography

### Font Stack
- **Primary**: System fonts (Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- **Monospace**: For code or technical content

### Font Sizes & Weights
- **Headings**:
  - H1: `text-4xl font-extrabold` (36px, 800 weight)
  - H2: `text-3xl font-bold` (30px, 700 weight)
  - H3: `text-xl font-semibold` (20px, 600 weight)
  - H4: `text-lg font-medium` (18px, 500 weight)

- **Body Text**:
  - Large: `text-lg` (18px, 400 weight)
  - Regular: `text-base` (16px, 400 weight)
  - Small: `text-sm` (14px, 400 weight)
  - Extra Small: `text-xs` (12px, 400 weight)

### Text Colors
- **Primary**: `text-gray-900` - Main content
- **Secondary**: `text-gray-600` - Supporting text
- **Muted**: `text-gray-500` - Less important text
- **Disabled**: `text-gray-400` - Disabled states

## Layout System

### Container Structure
```css
/* Main container for all pages */
.min-h-screen bg-gray-50

/* Content wrapper */
.max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8

/* Grid layouts */
.grid grid-cols-1 lg:grid-cols-3 gap-8
```

### Spacing Scale
- **Extra Small**: `space-y-2` (8px)
- **Small**: `space-y-4` (16px)
- **Medium**: `space-y-6` (24px)
- **Large**: `space-y-8` (32px)
- **Extra Large**: `space-y-12` (48px)

## Component System

### Cards
**Purpose**: Primary content containers for all major sections

**Structure**:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <p className="text-gray-600">Subtitle</p>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Styling**:
- Background: `bg-white`
- Border: `border border-gray-200`
- Shadow: `shadow rounded-lg`
- Padding: `p-6` (header), `px-6 py-4` (content)

### Buttons

**Primary Button**:
```jsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  <Icon className="w-4 h-4 mr-2" />
  Button Text
</Button>
```

**Secondary Button**:
```jsx
<Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
  <Icon className="w-4 h-4 mr-2" />
  Button Text
</Button>
```

**Status Buttons**:
- Success: `bg-green-600 hover:bg-green-700`
- Warning: `border-yellow-200 text-yellow-700 hover:bg-yellow-50`
- Error: `border-red-200 text-red-700 hover:bg-red-50`

### Progress Bars
```jsx
<Progress value={75} className="h-2" />
```
- Height: `h-2` (8px) for small, `h-3` (12px) for larger
- Color: Inherits from parent context

### Icons
- **Size**: `w-4 h-4` (16px) for inline, `w-5 h-5` (20px) for standalone
- **Color**: `text-gray-400` for neutral, `text-blue-600` for primary
- **Library**: Lucide React icons

## Page Structure

### Header
```jsx
<header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo and Navigation */}
      {/* User Profile */}
    </div>
  </div>
</header>
```

### Breadcrumbs
```jsx
<div className="flex items-center space-x-2 mb-6">
  <Link className="flex items-center text-gray-600 hover:text-gray-900">
    <ArrowLeft className="w-4 h-4 mr-1" />
    Back to Previous
  </Link>
</div>
```

### Main Content Grid
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Left Column - Sidebar/Info */}
  <div className="lg:col-span-1 space-y-6">
    {/* Cards */}
  </div>
  
  {/* Right Column - Main Content */}
  <div className="lg:col-span-2 space-y-6">
    {/* Cards */}
  </div>
</div>
```

## Specific Page Patterns

### Dashboard Pages
- **Layout**: Single column with cards in grid
- **Stats Cards**: 3-column grid with icons and metrics
- **Action Cards**: Feature buttons and quick actions
- **Data Tables**: Clean tables with hover states

### Form Pages
- **Layout**: Centered single column
- **Form Groups**: Consistent spacing and labels
- **Validation**: Clear error states with red text
- **Actions**: Right-aligned button groups

### Detail Pages
- **Layout**: 2-column grid (sidebar + main content)
- **Sidebar**: User info, scores, quick actions
- **Main Content**: Detailed information, forms, lists

### List Pages
- **Layout**: Single column with search/filter header
- **Items**: Card-based list items
- **Pagination**: Clean pagination controls
- **Empty States**: Helpful empty state messages

## Interactive States

### Hover States
- **Cards**: Subtle shadow increase
- **Buttons**: Color darkening
- **Links**: Color change
- **Tables**: Row highlighting

### Focus States
- **Form Elements**: Blue ring focus
- **Buttons**: Consistent focus styling
- **Accessibility**: Clear focus indicators

### Loading States
- **Spinners**: Centered loading spinners
- **Skeletons**: Placeholder content
- **Progress**: Progress bars for long operations

## Responsive Design

### Breakpoints
- **Mobile**: `< 640px` - Single column, stacked layout
- **Tablet**: `640px - 1024px` - Adjusted spacing, medium columns
- **Desktop**: `> 1024px` - Full layout, sidebars

### Mobile Adaptations
- **Navigation**: Collapsible menu
- **Grids**: Stack to single column
- **Cards**: Full width, adjusted padding
- **Buttons**: Full width on mobile

## Accessibility

### Color Contrast
- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Clear hover/focus states
- **Status Colors**: Accessible color combinations

### Keyboard Navigation
- **Focus Order**: Logical tab order
- **Skip Links**: Skip to main content
- **ARIA Labels**: Proper labeling for screen readers

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: Descriptive image alt text
- **ARIA**: Appropriate ARIA attributes

## Implementation Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Maintain consistent spacing with design tokens
- Follow mobile-first responsive approach

### Component Structure
- Reusable components for common patterns
- Consistent prop interfaces
- Clear component documentation

### State Management
- Clear loading, error, and success states
- Consistent error handling
- User-friendly feedback messages

## Migration Strategy

### Phase 1: Core Components
1. Update button components
2. Implement card system
3. Update typography scale
4. Establish color palette

### Phase 2: Page Layouts
1. Update header/navigation
2. Implement grid layouts
3. Update form styling
4. Add responsive behavior

### Phase 3: Advanced Features
1. Add loading states
2. Implement empty states
3. Add animations/transitions
4. Optimize accessibility

### Phase 4: Polish
1. Add micro-interactions
2. Optimize performance
3. Cross-browser testing
4. User testing and feedback

## File Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Progress.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── ...
├── styles/
│   ├── globals.css
│   └── components.css
└── utils/
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

This design system provides a solid foundation for creating a modern, professional, and user-friendly recruitment platform that maintains consistency across all pages while providing excellent user experience. 