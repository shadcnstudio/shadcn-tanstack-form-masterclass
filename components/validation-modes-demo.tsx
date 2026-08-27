"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

const demoSchema = z.object({
  value: z
    .string()
    .min(5, "Must be at least 5 characters")
    .max(20, "Must be at most 20 characters"),
})

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

const TAKEN_USERNAMES = ["admin", "root", "tanstack", "shadcn", "support"]

export default function ValidationModesDemo() {
  const [submitCounts, setSubmitCounts] = React.useState({
    onChange: 0,
    onBlur: 0,
    onSubmit: 0,
    onChangeAsync: 0,
  })

  // onChange Mode - Validates on every keystroke
  const onChangeForm = useForm({
    defaultValues: { value: "" },
    validators: { onChange: demoSchema },
    onSubmit: async () => {
      setSubmitCounts((prev) => ({ ...prev, onChange: prev.onChange + 1 }))
    },
  })

  // onBlur Mode - Validates when field loses focus
  const onBlurForm = useForm({
    defaultValues: { value: "" },
    validators: { onBlur: demoSchema },
    onSubmit: async () => {
      setSubmitCounts((prev) => ({ ...prev, onBlur: prev.onBlur + 1 }))
    },
  })

  // onSubmit Mode - Validates only when form is submitted
  const onSubmitForm = useForm({
    defaultValues: { value: "" },
    validators: { onSubmit: demoSchema },
    onSubmit: async () => {
      setSubmitCounts((prev) => ({ ...prev, onSubmit: prev.onSubmit + 1 }))
    },
  })

  // onChangeAsync Mode - Debounced validation with network call
  const onChangeAsyncForm = useForm({
    defaultValues: { value: "" },
    onSubmit: async () => {
      setSubmitCounts((prev) => ({
        ...prev,
        onChangeAsync: prev.onChangeAsync + 1,
      }))
    },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Validation Modes Demo
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          TanStack Form lets you control when validation happens. Try typing in
          each field to see the difference between modes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* onChange Mode */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">onChange Mode</h3>
            <p className="text-sm text-muted-foreground">
              Validates on every keystroke
            </p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChangeForm.handleSubmit()
            }}
            className="space-y-4"
          >
            <onChangeForm.Field name="value">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="mode-onchange">Demo Input</FieldLabel>
                    <Input
                      id="mode-onchange"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Type here..."
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Error appears <strong>instantly</strong> as you type
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </onChangeForm.Field>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChangeForm.reset()}
              >
                Reset
              </Button>
            </div>

            {submitCounts.onChange > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                ✓ Submitted {submitCounts.onChange} time(s)
              </p>
            )}
          </form>
        </div>

        {/* onBlur Mode */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">onBlur Mode</h3>
            <p className="text-sm text-muted-foreground">
              Validates when you leave the field
            </p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onBlurForm.handleSubmit()
            }}
            className="space-y-4"
          >
            <onBlurForm.Field name="value">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="mode-onblur">Demo Input</FieldLabel>
                    <Input
                      id="mode-onblur"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Type here..."
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Error appears <strong>after</strong> you leave the field
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </onBlurForm.Field>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onBlurForm.reset()}
              >
                Reset
              </Button>
            </div>

            {submitCounts.onBlur > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                ✓ Submitted {submitCounts.onBlur} time(s)
              </p>
            )}
          </form>
        </div>

        {/* onSubmit Mode */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">onSubmit Mode</h3>
            <p className="text-sm text-muted-foreground">
              Validates only when you click submit
            </p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSubmitForm.handleSubmit()
            }}
            className="space-y-4"
          >
            <onSubmitForm.Field name="value">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="mode-onsubmit">Demo Input</FieldLabel>
                    <Input
                      id="mode-onsubmit"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Type here..."
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Error appears <strong>only</strong> after clicking submit
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </onSubmitForm.Field>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSubmitForm.reset()}
              >
                Reset
              </Button>
            </div>

            {submitCounts.onSubmit > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                ✓ Submitted {submitCounts.onSubmit} time(s)
              </p>
            )}
          </form>
        </div>

        {/* onChangeAsync Mode */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">onChangeAsync Mode</h3>
            <p className="text-sm text-muted-foreground">
              Debounced validation with async checks
            </p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChangeAsyncForm.handleSubmit()
            }}
            className="space-y-4"
          >
            <onChangeAsyncForm.Field
              name="value"
              asyncDebounceMs={500}
              validators={{
                onChange: z
                  .string()
                  .min(3, "Must be at least 3 characters")
                  .max(20, "Must be at most 20 characters"),
                onChangeAsync: async ({ value, signal }) => {
                  await sleep(700)
                  if (signal.aborted) return undefined

                  return TAKEN_USERNAMES.includes(value.trim().toLowerCase())
                    ? { message: `"${value}" is already taken` }
                    : undefined
                },
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="mode-onchangeasync">
                      Username
                    </FieldLabel>
                    <Input
                      id="mode-onchangeasync"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Try 'admin' or 'tanstack'"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Waits <strong>500ms</strong> after you stop typing, then
                      checks availability
                    </FieldDescription>
                    {field.state.meta.isValidating && (
                      <FieldDescription className="text-primary">
                        Checking availability…
                      </FieldDescription>
                    )}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </onChangeAsyncForm.Field>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChangeAsyncForm.reset()}
              >
                Reset
              </Button>
            </div>

            {submitCounts.onChangeAsync > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                ✓ Submitted {submitCounts.onChangeAsync} time(s)
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-4">
          <h3 className="font-semibold">When Validation Occurs</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-4 text-left font-semibold">Mode</th>
              <th className="p-4 text-left font-semibold">
                When Validation Occurs
              </th>
              <th className="p-4 text-left font-semibold">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="transition-colors hover:bg-muted/20">
              <td className="p-4 font-medium">onChange</td>
              <td className="p-4">Every keystroke</td>
              <td className="p-4 text-muted-foreground">
                Real-time feedback (e.g., password strength)
              </td>
            </tr>
            <tr className="transition-colors hover:bg-muted/20">
              <td className="p-4 font-medium">onBlur</td>
              <td className="p-4">When you leave the field</td>
              <td className="p-4 text-muted-foreground">
                Less intrusive validation (recommended)
              </td>
            </tr>
            <tr className="transition-colors hover:bg-muted/20">
              <td className="p-4 font-medium">onSubmit</td>
              <td className="p-4">When form is submitted</td>
              <td className="p-4 text-muted-foreground">
                Simple forms, minimal interruption
              </td>
            </tr>
            <tr className="transition-colors hover:bg-muted/20">
              <td className="p-4 font-medium">onChangeAsync</td>
              <td className="p-4">Debounced async checks</td>
              <td className="p-4 text-muted-foreground">
                Availability checks, server-side validation
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <span className="text-xl">💡</span>
          <span>Pro Tip</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          The{" "}
          <code className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
            onBlur
          </code>{" "}
          mode is recommended for most forms as it provides a good balance
          between user experience and validation feedback. Use{" "}
          <code className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
            onChange
          </code>{" "}
          for fields that benefit from immediate feedback, like password
          strength indicators.
        </p>
      </div>
    </div>
  )
}
