"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GitHubStarButtonProps {
  owner: string
  repo: string
  className?: string
}

const formatStars = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

export default function GitHubStarButton({
  owner,
  repo,
  className,
}: GitHubStarButtonProps) {
  const [stars, setStars] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
            // Cache for 5 minutes
            next: { revalidate: 300 },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setStars(data.stargazers_count)
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStars()
  }, [owner, repo])

  return (
    <Link
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="outline"
        className={cn(
          "group relative gap-2 overflow-hidden transition-all duration-300",
          "hover:border-foreground/40 hover:shadow-md",
          className
        )}
      >
        <StarIcon
          className={cn(
            "transition-all duration-300",
            isHovered
              ? "scale-110 rotate-12 fill-yellow-500 text-yellow-500"
              : "text-foreground/60"
          )}
        />
        <span className="font-medium">Star on GitHub</span>
        {isLoading && (
          <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground/60" />
        )}
        {!isLoading && stars !== null && (
          <span
            className={cn(
              "rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors duration-300",
              isHovered && "bg-foreground/10"
            )}
          >
            {formatStars(stars)}
          </span>
        )}
      </Button>
    </Link>
  )
}
