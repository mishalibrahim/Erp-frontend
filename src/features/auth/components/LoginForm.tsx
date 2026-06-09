import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";
import { Form } from "@/components/hook-form/Form";
import { FormInput } from "@/components/hook-form/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! You are now signed in.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your credentials to access the dashboard.
        </p>
      </div>

      <Form methods={form} onSubmit={onSubmit} className="flex flex-col gap-5">
        <FormInput
          name="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />

        <div>
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <a
              href="#"
              className="text-xs text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-1 h-11 w-full rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Sign in →"
          )}
        </Button>
      </Form>
    </div>
  );
};

