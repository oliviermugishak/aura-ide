import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  createContext,
  useContext,
} from "react";

// ===== SHARED TYPES & INTERFACES =====
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

interface PolymorphicProps<T extends React.ElementType = "div"> {
  as?: T;
}

type ComponentPropsWithoutRef<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & BaseComponentProps & PolymorphicProps<T>;

// ===== AURORA THEME PROVIDER =====
interface AuroraTheme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

const defaultTheme: AuroraTheme = {
  colors: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    tertiary: "#06b6d4",
    background: "#0f0f23",
    surface: "#1a1a2e",
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    border: "#374151",
    accent: "#f59e0b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
  },
};

const AuroraThemeContext = createContext<AuroraTheme>(defaultTheme);

interface AuroraProviderProps {
  children: React.ReactNode;
  theme?: Partial<AuroraTheme>;
}

const AuroraProvider: React.FC<AuroraProviderProps> = ({
  children,
  theme = {},
}) => {
  const mergedTheme = React.useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
      colors: { ...defaultTheme.colors, ...(theme.colors || {}) },
      spacing: { ...defaultTheme.spacing, ...(theme.spacing || {}) },
      borderRadius: {
        ...defaultTheme.borderRadius,
        ...(theme.borderRadius || {}),
      },
    }),
    [theme]
  );

  return (
    <AuroraThemeContext.Provider value={mergedTheme}>
      {children}
    </AuroraThemeContext.Provider>
  );
};

const useAuroraTheme = () => {
  const context = useContext(AuroraThemeContext);
  if (!context) {
    throw new Error("useAuroraTheme must be used within an AuroraProvider");
  }
  return context;
};

// ===== BUTTON COMPONENT =====
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "link";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "md",
      variant = "primary",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = false,
      className = "",
      disabled,
      children,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const theme = useAuroraTheme();

    const sizeClasses = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    const variantClasses = {
      primary:
        "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
      secondary:
        "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 focus:ring-purple-500",
      tertiary:
        "bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
      outline:
        "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700 focus:ring-gray-500",
      ghost:
        "bg-transparent text-gray-300 border-transparent hover:bg-gray-800 focus:ring-gray-500",
      link: "bg-transparent text-indigo-400 border-transparent hover:text-indigo-300 focus:ring-indigo-500 underline-offset-4 hover:underline",
    };

    const baseClasses = `
    inline-flex items-center justify-center
    border font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${rounded ? "rounded-full" : "rounded-md"}
    ${fullWidth ? "w-full" : ""}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
  `;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${className}`.trim()}
        disabled={disabled || loading}
        data-testid={testId}
        {...props}
      >
        {loading && (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {loading ? loadingText || "Loading..." : children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

// ===== INPUT COMPONENT =====
type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled" | "unstyled";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  invalid?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "default",
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      invalid = false,
      required = false,
      className = "",
      disabled,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const theme = useAuroraTheme();
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const variantClasses = {
      default: `
      bg-gray-900 border-gray-600 text-white placeholder-gray-400
      hover:border-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
    `,
      filled: `
      bg-gray-800 border-transparent text-white placeholder-gray-400
      hover:bg-gray-700 focus:bg-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
    `,
      unstyled:
        "bg-transparent border-none text-white placeholder-gray-400 focus:outline-none",
    };

    const baseClasses = `
    w-full rounded-md border transition-all duration-200 ease-in-out
    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${
      invalid || error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : ""
    }
    ${leftElement ? "pl-10" : ""}
    ${rightElement ? "pr-10" : ""}
  `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftElement}</div>
            </div>
          )}
          <input
            ref={ref}
            className={`${baseClasses} ${className}`.trim()}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            data-testid={testId}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">{rightElement}</div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ===== DROPDOWN COMPONENT =====
interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

type DropdownSize = "sm" | "md" | "lg";
type DropdownVariant = "default" | "filled" | "borderless";

interface DropdownProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  options: DropdownOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  size?: DropdownSize;
  variant?: DropdownVariant;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  maxHeight?: string;
  required?: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder = "Select an option...",
      size = "md",
      variant = "default",
      label,
      error,
      helperText,
      disabled = false,
      searchable = false,
      clearable = false,
      multiple = false,
      onChange,
      onSearchChange,
      loading = false,
      loadingText = "Loading...",
      emptyText = "No options found",
      maxHeight = "200px",
      required = false,
      className = "",
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
      multiple
        ? Array.isArray(value)
          ? value
          : defaultValue
          ? [defaultValue]
          : []
        : value !== undefined
        ? [value]
        : defaultValue
        ? [defaultValue]
        : []
    );

    const dropdownRef = useRef<HTMLDivElement>(null);
    const theme = useAuroraTheme();

    // Handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Group options
    const groupedOptions = filteredOptions.reduce((groups, option) => {
      const group = option.group || "default";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {} as Record<string, DropdownOption[]>);

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm min-h-[32px]",
      md: "px-4 py-2 text-base min-h-[40px]",
      lg: "px-4 py-3 text-lg min-h-[48px]",
    };

    const variantClasses = {
      default: `
      bg-gray-900 border-gray-600 text-white
      hover:border-gray-500 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500
    `,
      filled: `
      bg-gray-800 border-transparent text-white
      hover:bg-gray-700 focus-within:bg-gray-900 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500
    `,
      borderless:
        "bg-transparent border-transparent text-white hover:bg-gray-800",
    };

    const baseClasses = `
    relative w-full rounded-md border cursor-pointer transition-all duration-200 ease-in-out
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${
      error
        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
        : ""
    }
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
  `;

    const handleOptionSelect = (optionValue: string | number) => {
      let newValues: (string | number)[];

      if (multiple) {
        if (selectedValues.includes(optionValue)) {
          newValues = selectedValues.filter((v) => v !== optionValue);
        } else {
          newValues = [...selectedValues, optionValue];
        }
      } else {
        newValues = [optionValue];
        setIsOpen(false);
      }

      setSelectedValues(newValues);
      onChange?.(multiple ? newValues : newValues[0]);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onChange?.(multiple ? [] : "");
    };

    const getDisplayValue = () => {
      if (selectedValues.length === 0) {
        return placeholder;
      }

      if (multiple) {
        return `${selectedValues.length} selected`;
      }

      const selectedOption = options.find(
        (opt) => opt.value === selectedValues[0]
      );
      return selectedOption?.label || placeholder;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div ref={dropdownRef} className="relative" {...props}>
          <div
            ref={ref}
            className={`${baseClasses} ${className}`.trim()}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            data-testid={testId}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={
                  selectedValues.length === 0 ? "text-gray-400" : "text-white"
                }
              >
                {getDisplayValue()}
              </span>

              <div className="flex items-center space-x-2">
                {clearable && selectedValues.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown Panel */}
          {isOpen && (
            <div
              className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg"
              style={{ maxHeight }}
            >
              {searchable && (
                <div className="p-2 border-b border-gray-600">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      onSearchChange?.(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100% - 60px)" }}
              >
                {loading ? (
                  <div className="px-3 py-2 text-gray-400 text-center">
                    {loadingText}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-gray-400 text-center">
                    {emptyText}
                  </div>
                ) : (
                  Object.entries(groupedOptions).map(
                    ([groupName, groupOptions]) => (
                      <div key={groupName}>
                        {groupName !== "default" && (
                          <div className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-700 border-b border-gray-600">
                            {groupName}
                          </div>
                        )}
                        {groupOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            disabled={option.disabled}
                            onClick={() =>
                              !option.disabled &&
                              handleOptionSelect(option.value)
                            }
                            className={`
                          w-full px-3 py-2 text-left text-sm transition-colors
                          ${
                            option.disabled
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                          }
                          ${
                            selectedValues.includes(option.value)
                              ? "bg-indigo-600 text-white"
                              : ""
                          }
                        `}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
                              {selectedValues.includes(option.value) && (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

// ===== PREVIEW DEMO =====
export const PreviewDemo = () => {
  const [inputValue, setInputValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [multiDropdownValue, setMultiDropdownValue] = useState<
    (string | number)[]
  >([]);

  const dropdownOptions = [
    { value: "option1", label: "Option 1", group: "Group A" },
    { value: "option2", label: "Option 2", group: "Group A" },
    { value: "option3", label: "Option 3", group: "Group B" },
    { value: "option4", label: "Option 4", group: "Group B" },
    {
      value: "option5",
      label: "Disabled Option",
      disabled: true,
      group: "Group B",
    },
  ];

  return (
    <AuroraProvider>
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Aurora UI Preview
            </h1>
            <p className="text-gray-400 text-lg">
              Base components with minimal styling and maximum flexibility
            </p>
          </div>

          {/* Button Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              Buttons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Variants</h3>
                <div className="space-y-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="tertiary">Tertiary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Sizes</h3>
                <div className="space-y-3">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">
                  States & Features
                </h3>
                <div className="space-y-3">
                  <Button loading>Loading Button</Button>
                  <Button disabled>Disabled Button</Button>
                  <Button leftIcon={<span>🚀</span>}>With Left Icon</Button>
                  <Button rightIcon={<span>→</span>}>With Right Icon</Button>
                  <Button fullWidth>Full Width Button</Button>
                  <Button rounded>Rounded Button</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Input Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              Inputs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Default Input"
                  placeholder="Enter text here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Input
                  label="With Helper Text"
                  placeholder="Email address"
                  helperText="We'll never share your email"
                  type="email"
                />

                <Input
                  label="Required Field"
                  placeholder="Required input"
                  required
                />

                <Input
                  label="With Error"
                  placeholder="Invalid input"
                  error="This field is required"
                  invalid
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="With Left Element"
                  placeholder="Search..."
                  leftElement={<span>🔍</span>}
                />

                <Input
                  label="With Right Element"
                  placeholder="Password"
                  type="password"
                  rightElement={<span>👁</span>}
                />

                <Input
                  label="Filled Variant"
                  variant="filled"
                  placeholder="Filled input"
                />

                <Input
                  size="lg"
                  label="Large Size"
                  placeholder="Large input field"
                />
              </div>
            </div>
          </section>

          {/* Dropdown Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
              Dropdowns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Dropdown
                  label="Basic Dropdown"
                  options={dropdownOptions}
                  placeholder="Select an option"
                  value={dropdownValue}
                  onChange={(value) => setDropdownValue(value as string)}
                />

                <Dropdown
                  label="Searchable Dropdown"
                  options={dropdownOptions}
                  searchable
                  clearable
                  placeholder="Search options..."
                />

                <Dropdown
                  label="Multiple Selection"
                  options={dropdownOptions}
                  multiple
                  searchable
                  clearable
                  value={multiDropdownValue}
                  onChange={(value) =>
                    setMultiDropdownValue(value as (string | number)[])
                  }
                  placeholder="Select multiple options"
                />
              </div>

              <div className="space-y-4">
                <Dropdown
                  label="With Helper Text"
                  options={dropdownOptions}
                  helperText="Choose from the available options"
                  placeholder="Helper text example"
                />

                <Dropdown
                  label="With Error"
                  options={dropdownOptions}
                  error="Please select an option"
                  placeholder="Error state example"
                />

                <Dropdown
                  label="Filled Variant"
                  options={dropdownOptions}
                  variant="filled"
                  placeholder="Filled dropdown"
                />

                <Dropdown
                  label="Large Size"
                  options={dropdownOptions}
                  size="lg"
                  placeholder="Large dropdown"
                />
              </div>
            </div>
          </section>

          {/* Customization Example */}
        </div>
      </div>
    </AuroraProvider>
  );
};
