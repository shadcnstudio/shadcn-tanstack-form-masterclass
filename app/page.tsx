import GitHubStarButton from "@/components/github-star-button"
import ValidationModesDemo from "@/components/validation-modes-demo"
import RegistrationForm from "@/components/registration-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Shadcn Tanstack Forms Masterclass
          </h1>
          <p className="mx-auto max-w-3xl text-xl font-medium text-muted-foreground">
            Tanstack + Zod + Shadcn UI
          </p>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A comprehensive guide to building production-ready forms with
            validation
          </p>
          <div className="flex justify-center">
            <GitHubStarButton
              owner="shadcnstudio"
              repo="shadcn-tanstack-form-masterclass"
            />
          </div>
        </div>

        {/* Validation Modes Demo */}
        <div className="mx-auto max-w-4xl rounded-xl border p-8 shadow-lg md:p-10">
          <ValidationModesDemo />
        </div>

        {/* Divider */}
        <div className="mx-auto my-16 w-full max-w-4xl border-t" />

        {/* Main Registration Form */}
        <div className="mx-auto max-w-4xl rounded-xl border p-8 shadow-lg md:p-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Comprehensive Registration Form
            </h2>
          </div>
          <RegistrationForm />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built with Next.js 16, TanStack Form, Zod, and Shadcn UI</p>
        </div>
      </div>
    </div>
  )
}
