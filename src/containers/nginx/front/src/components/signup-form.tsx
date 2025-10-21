import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
const [username, setUsername] = useState("")
  //const [usernameError, setUsernameError] = useState("")

  const handleUsernameBlur = () => {

  }

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handlePasswordlBlur = () => {
    if (password.length < 8) {
      setPasswordError("Password is not enough long")
    } else {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      alert(data.error || "Failed to sign up")
    } else {
      alert("Account created successfully!")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-left gap-0">
          <CardTitle className="text-xl">ft_transcendence</CardTitle>
          <CardDescription>
            Create your account and enjoy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup className="gap-3">
              <Field data-valid>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleUsernameBlur}
                  required
                />
              </Field>
              <Field data-valid>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  required
                />
                {emailError && (
                  <FieldError className="-mt-2">Enter a valid email address.</FieldError>
                )}
              </Field>
              <Field data-valid>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordlBlur}
                  required
                />
                {passwordError && (
                  <FieldError className="-mt-2">Not enough characters.</FieldError>
                )}
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button onSubmit={handleSubmit} type="submit">Sign up</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
