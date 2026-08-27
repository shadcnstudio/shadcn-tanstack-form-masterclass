"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

// 1. Schema

const formSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(1, "Full name is required.")
    .min(3, "Full name must be at least 3 characters.")
    .max(50, "Full name must be at most 50 characters."),
  email: z
    .string()
    .min(1, "Email is required.")
    // Zod v4: `z.email()` is the top-level validator. Piping keeps the
    // "required" message distinct from the "malformed" message.
    .pipe(z.email("Please enter a valid email address.")),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    ),

  // Profile Details
  dateOfBirth: z.date({ error: "Date of birth is required." }),
  ageRange: z
    .number({ error: "Age is required." })
    .int("Age must be a whole number.")
    .min(18, "You must be at least 18 years old.")
    .max(120, "Please enter a valid age."),
  country: z.string().min(1, "Please select your country."),
  language: z.string().optional(),
  bio: z
    .string()
    .min(1, "Bio is required.")
    .min(20, "Bio must be at least 20 characters.")
    .max(500, "Bio must be at most 500 characters."),

  // Preferences
  newsletterTopics: z
    .array(z.string())
    .min(1, "Please select at least one newsletter topic.")
    .max(3, "You can select up to 3 topics."),
  accountType: z.enum(["personal", "business", "enterprise"], {
    error: "Please select an account type.",
  }),

  // Communication Settings
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  twoFactorAuth: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

type FormState = Omit<
  z.input<typeof formSchema>,
  "dateOfBirth" | "ageRange" | "accountType"
> & {
  dateOfBirth: Date | undefined
  ageRange: number | undefined
  accountType: "" | FormValues["accountType"]
}

const defaultValues: FormState = {
  fullName: "",
  email: "",
  password: "",
  dateOfBirth: undefined,
  ageRange: undefined,
  country: "",
  language: "",
  bio: "",
  newsletterTopics: [],
  accountType: "",
  emailNotifications: true,
  marketingEmails: false,
  twoFactorAuth: false,
}

// 2. Define options for selects

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
]

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
]

const newsletterTopics = [
  { id: "updates", label: "Product Updates" },
  { id: "news", label: "Industry News" },
  { id: "tips", label: "Tips & Tricks" },
  { id: "events", label: "Events & Webinars" },
]

const accountTypes = [
  {
    id: "personal",
    title: "Personal",
    description: "For individual use with basic features",
  },
  {
    id: "business",
    title: "Business",
    description: "For small to medium-sized teams",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "For large organizations with advanced needs",
  },
]

const MAX_BIO_LENGTH = 500

// 3. Form

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [dobOpen, setDobOpen] = React.useState(false)
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null)

  const form = useForm({
    defaultValues,
    validators: { onChange: formSchema },
    onSubmit: async ({ value }) => {
      // Stand-in for a real request.
      await new Promise((resolve) => setTimeout(resolve, 600))
      console.log("Form submitted with data:", value)
      setSubmitted(value as FormValues)
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSubmitted(null)
        form.handleSubmit()
      }}
      className="flex flex-col gap-10"
    >
      {/* Personal Information */}
      <section className="flex flex-col gap-6 rounded-lg border p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">
            Personal Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Please provide your basic information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="fullName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  <FieldDescription>
                    Your full name as it appears on official documents
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                  />
                  <FieldDescription>
                    We&apos;ll never share your email with anyone else
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
                <FieldDescription>
                  Must be at least 8 characters with uppercase, lowercase, and
                  numbers
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </section>

      {/* Profile Details */}
      <section className="flex flex-col gap-6 rounded-lg border p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">
            Profile Details
          </h3>
          <p className="text-sm text-muted-foreground">
            Tell us more about yourself
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="dateOfBirth">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                  <Popover open={dobOpen} onOpenChange={setDobOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          id="dateOfBirth"
                          variant="outline"
                          aria-invalid={isInvalid}
                          onBlur={field.handleBlur}
                          className={cn(
                            "h-8 w-full justify-start font-normal",
                            !field.state.value && "text-muted-foreground"
                          )}
                        />
                      }
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.state.value
                        ? format(field.state.value, "PPP")
                        : "Pick a date"}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        autoFocus
                        selected={field.state.value}
                        onSelect={(date) => {
                          field.handleChange(date)
                          setDobOpen(false)
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>
                    Your date of birth is used to calculate your age
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="ageRange">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={18}
                    max={120}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const raw = e.target.value
                      // Inputs always hand back strings -- convert before the
                      // number schema ever sees the value.
                      field.handleChange(raw === "" ? undefined : Number(raw))
                    }}
                    aria-invalid={isInvalid}
                    placeholder="25"
                  />
                  <FieldDescription>
                    You must be at least 18 years old to register
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="country">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Select
                    items={countries}
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="country"
                      className="w-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>Your country of residence</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="language">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="language">
                    Preferred Language{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </FieldLabel>
                  <Select
                    items={languages}
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="language"
                      className="w-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Choose your preferred communication language
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Tell us about yourself..."
                  className="min-h-30 resize-none"
                />
                <FieldDescription>
                  {/* The character counter reads straight off form state --
                      no second useState to keep in sync. */}
                  Brief description about yourself ({field.state.value.length}/
                  {MAX_BIO_LENGTH} characters)
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </section>

      {/* Preferences */}
      <section className="flex flex-col gap-6 rounded-lg border p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Customize your experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="newsletterTopics">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <FieldSet>
                  <FieldLegend variant="label">Newsletter Topics</FieldLegend>
                  <FieldDescription>
                    Choose up to 3 topics you want updates about
                  </FieldDescription>
                  <FieldGroup data-slot="checkbox-group">
                    {newsletterTopics.map((topic) => (
                      <Field
                        key={topic.id}
                        orientation="horizontal"
                        data-invalid={isInvalid}
                      >
                        <Checkbox
                          id={`newsletter-${topic.id}`}
                          name={field.name}
                          aria-invalid={isInvalid}
                          checked={field.state.value.includes(topic.id)}
                          onBlur={field.handleBlur}
                          onCheckedChange={(checked) => {
                            field.handleChange((prev) =>
                              checked
                                ? [...prev, topic.id]
                                : prev.filter((value) => value !== topic.id)
                            )
                          }}
                        />
                        <FieldLabel
                          htmlFor={`newsletter-${topic.id}`}
                          className="font-normal"
                        >
                          {topic.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>

          <form.Field name="accountType">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <FieldSet>
                  <FieldLegend variant="label">Account Type</FieldLegend>
                  <FieldDescription>
                    Choose the plan that best fits your needs
                  </FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as FormValues["accountType"])
                    }
                  >
                    {accountTypes.map((type) => (
                      <FieldLabel
                        key={type.id}
                        htmlFor={`account-${type.id}`}
                        className="cursor-pointer rounded-lg border-2 border-muted transition-all hover:border-primary/50 hover:shadow-sm has-checked:border-primary has-checked:bg-primary/5"
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={isInvalid}
                          className="gap-4"
                        >
                          <FieldContent className="flex-1">
                            <FieldTitle className="font-medium">
                              {type.title}
                            </FieldTitle>
                            <FieldDescription className="mt-1 text-sm">
                              {type.description}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={type.id}
                            id={`account-${type.id}`}
                            aria-invalid={isInvalid}
                            onBlur={field.handleBlur}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>
        </div>
      </section>

      {/* Communication Settings */}
      <section className="flex flex-col gap-6 rounded-lg border p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight">
            Communication Settings
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <form.Field name="emailNotifications">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="emailNotifications">
                    Email Notifications
                  </FieldLabel>
                  <FieldDescription>
                    Receive notifications about your account activity
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="emailNotifications"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="marketingEmails">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="marketingEmails">
                    Marketing Emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails about new products and features
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="marketingEmails"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="twoFactorAuth">
            {(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="twoFactorAuth">
                    Two-Factor Authentication
                  </FieldLabel>
                  <FieldDescription>
                    Add an extra layer of security to your account
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="twoFactorAuth"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="flex justify-center gap-4">
              <Button
                type="submit"
                size="lg"
                className="min-w-35"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-w-35"
                disabled={isSubmitting}
                onClick={() => {
                  setSubmitted(null)
                  form.reset()
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </form.Subscribe>

        {submitted && (
          <div className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              ✓ Registered successfully
            </p>
            <pre className="overflow-x-auto text-xs text-muted-foreground">
              <code>{JSON.stringify(submitted, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </form>
  )
}
