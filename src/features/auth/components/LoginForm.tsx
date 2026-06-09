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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Successfully logged in!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[420px] mx-auto z-10">
      <div className="relative bg-card text-card-foreground rounded-3xl p-10 w-full shadow-xl border border-border">
        <div className="text-center mb-8 relative z-10">
          <h2 className="m-0 text-[28px] font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Form methods={form} onSubmit={onSubmit} className="flex flex-col gap-5 relative z-10">
          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="admin@aegis-erp.com"
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            className="mt-2 px-6 py-6 rounded-xl font-semibold text-base transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
};
