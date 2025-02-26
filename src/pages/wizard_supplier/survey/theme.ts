export const themeJson = {
  "themeName": "shadcn",
  "colorPalette": "light",
  "isPanelless": true, // Or false, depending on your design preference
  "backgroundImage": "", // Add your background image URL if needed
  "backgroundImageAttachment": "scroll",
  "backgroundImageFit": "cover",
  "cssVariables": {
    "--sjs-base-unit": "6px", // Base spacing unit. Shadcn uses 8px, consider adjusting SurveyJS layout.
    "--sjs-corner-radius": "0.5rem", // General corner radius. Shadcn often uses rounded-md (0.375rem) or rounded-lg (0.5rem).
    "--sjs-border-default": "1px solid hsl(var(--border))", // Default border. Shadcn uses `border` class. Consider `border-muted` for a softer look.
    "--sjs-border-light": "1px solid hsl(var(--border))", // Lighter border. Could map to `border-border`.
    "--sjs-border-inside": "1px solid hsl(var(--border))", // Border inside elements. Likely same as default border.

    "--sjs-font-size": "0.875rem", // Base font size. Shadcn uses `text-sm` (0.875rem) or `text-base` (1rem).
    "--sjs-font-editorfont-size": "0.875rem", // Editor font size. Match base font size.
    "--sjs-font-editorfont-family": "var(--font-sans)", // Editor font family. Use the standard sans-serif font.
    "--sjs-font-editorfont-weight": "400", // Editor font weight. Consider `font-normal` (400).
    "--sjs-font-editorfont-color": "hsl(var(--foreground))", // Editor font color. Use the standard foreground color.

    "--sjs-font-questiontitle-family": "var(--font-sans)", // Question title font family.
    "--sjs-font-questiontitle-weight": "600", // Question title font weight. `font-semibold` (600) is a good choice.
    "--sjs-font-questiontitle-color": "hsl(var(--foreground))", // Question title color.
    "--sjs-font-questiontitle-size": "1rem", // Question title size. `text-base` (1rem) or `text-lg` (1.125rem).

    "--sjs-font-pagetitle-family": "var(--font-sans)", // Page title font family.
    "--sjs-font-pagetitle-weight": "700", // Page title font weight. `font-bold` (700).
    "--sjs-font-pagetitle-size": "1.5rem", // Page title size. `text-2xl` (1.5rem) or `text-3xl` (1.875rem).
    "--sjs-font-pagetitle-color": "hsl(var(--foreground))", // Page title color.

    "--sjs-font-pagedescription-family": "var(--font-sans)", // Page description font family.
    "--sjs-font-pagedescription-weight": "400", // Page description font weight.
    "--sjs-font-pagedescription-size": "0.875rem", // Page description size. `text-sm`.
    "--sjs-font-pagedescription-color": "hsl(var(--foreground))", // Page description color. Consider `text-muted-foreground`.

    "--sjs-font-surveytitle-family": "var(--font-sans)", // Survey title font family.
    "--sjs-font-surveytitle-size": "2rem", // Survey title size.
    "--sjs-font-surveytitle-weight": "700", // Survey title weight.

    "--sjs-font-questiondescription-family": "var(--font-sans)", // Question description font family.
    "--sjs-font-questiondescription-weight": "400", // Question description font weight.
    "--sjs-font-questiondescription-color": "hsl(var(--foreground))", // Question description color. Consider `text-muted-foreground`.
    "--sjs-font-questiondescription-size": "0.875rem", // Question description size. `text-sm`.

    "--sjs-general-forecolor": "hsl(var(--foreground))", // General foreground color.
    "--sjs-general-forecolor-light": "hsl(var(--muted-foreground))", // Lighter foreground color. `text-muted-foreground`.
    "--sjs-general-dim-forecolor": "hsl(var(--foreground))", // Dim foreground color. Consider `text-muted-foreground`.
    "--sjs-general-dim-forecolor-light": "hsl(var(--muted-foreground))", // Lighter dim foreground color.

    "--sjs-general-backcolor": "hsl(var(--background))", // General background color.
    "--sjs-general-backcolor-dim": "hsl(var(--muted))", // Dim background color. `bg-muted`.
    "--sjs-general-backcolor-dim-light": "hsl(var(--muted))", // Lighter dim background color.
    "--sjs-general-backcolor-dark": "hsl(var(--popover))", // Dark background color. `bg-popover`.

    "--sjs-secondary-backcolor": "hsl(var(--secondary))", // Secondary background color. `bg-secondary`.

    "--sjs-primary-backcolor": "hsl(var(--primary))", // Primary background color. `bg-primary`.
    "--sjs-primary-backcolor-light": "hsl(var(--primary))", // Lighter primary background color. Consider an opacity value.
    "--sjs-primary-backcolor-dark": "hsl(var(--primary))", // Darker primary background color. Consider `dark:bg-primary-dark`.
    "--sjs-primary-forecolor": "hsl(var(--primary-foreground))", // Primary foreground color. `text-primary-foreground`.
    "--sjs-primary-forecolor-light": "hsl(var(--primary-foreground))", // Lighter primary foreground color.

    "--sjs-special-red": "hsl(var(--destructive))", // Special red color (error). `text-destructive`.
    "--sjs-special-red-light": "hsl(var(--destructive))", // Lighter special red color.
    "--sjs-special-green": "hsl(var(--success))", // Special green color (success).
    "--sjs-special-green-light": "hsl(var(--success))", // Lighter special green color.
    "--sjs-special-yellow": "hsl(var(--warning))", // Special yellow color (warning).
    "--sjs-special-yellow-light": "hsl(var(--warning))", // Lighter special yellow color.

    "--sjs-shadow-small": "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Small shadow. `shadow-sm`.
    "--sjs-shadow-medium": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Medium shadow. `shadow`.
    "--sjs-shadow-large": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // Large shadow. `shadow-lg`.
    "--sjs-shadow-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)", // Inner shadow. `shadow-inner`.

    "--sjs-questionpanel-backcolor": "hsl(var(--card))", // Question panel background color. `bg-card`.
    "--sjs-questionpanel-hovercolor": "hsl(var(--card))", // Question panel hover color. Slightly darken the card color.
    "--sjs-questionpanel-cornerRadius": "0.5rem", // Question panel corner radius. Match the base corner radius.
    "--sjs-question-background": "transparent", // Question background. Often transparent.
    "--sjs-editorpanel-backcolor": "hsl(var(--background))", // Editor panel background color.
    "--sjs-editorpanel-hovercolor": "hsl(var(--background))", // Editor panel hover color.
    "--sjs-editorpanel-cornerRadius": "0.5rem", // Editor panel corner radius.
    "--sjs-editor-background": "hsl(var(--background))" // Editor background.
  }
}