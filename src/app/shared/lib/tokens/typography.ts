/**
 * TailwindUI Typography Scale
 * Based on Tailwind CSS typography with TailwindUI conventions
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'BlinkMacSystemFont', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif'
    ],
    mono: [
      'ui-monospace', 
      'SFMono-Regular', 
      'Menlo', 
      'Monaco', 
      'Consolas', 
      'Liberation Mono', 
      'Courier New', 
      'monospace'
    ],
  },
  
  // Font sizes with line heights
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px, 16px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // 14px, 20px
    base: { size: '1rem', lineHeight: '1.5rem' },     // 16px, 24px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // 18px, 28px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px, 28px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // 24px, 32px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px, 36px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px, 40px
    '5xl': { size: '3rem', lineHeight: '1' },         // 48px
    '6xl': { size: '3.75rem', lineHeight: '1' },      // 60px
    '7xl': { size: '4.5rem', lineHeight: '1' },       // 72px
    '8xl': { size: '6rem', lineHeight: '1' },         // 96px
    '9xl': { size: '8rem', lineHeight: '1' },         // 128px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * Component-specific typography configurations
 */
export const componentTypography = {
  // Button typography
  button: {
    xs: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },
    sm: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
    md: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
    lg: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },
    xl: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },
  },
  
  // Heading typography
  heading: {
    h1: { fontSize: typography.fontSize['4xl'], fontWeight: typography.fontWeight.bold },
    h2: { fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold },
    h3: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold },
    h4: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold },
    h5: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium },
    h6: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },
  },
  
  // Body text
  body: {
    xs: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.normal },
    sm: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.normal },
    base: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.normal },
    lg: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.normal },
  },
} as const;
