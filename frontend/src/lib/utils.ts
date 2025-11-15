// Simple utility function to combine class names
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  
  // Alternative if you prefer a more robust solution without external dependencies
  export function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes
      .filter((cls): cls is string => Boolean(cls))
      .join(' ');
  }