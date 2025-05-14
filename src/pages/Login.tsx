
import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);
    
    if (success) {
      navigate("/");
    }
  };

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-eazybee-dark">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2000')] bg-cover bg-center opacity-20" />
      
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-eazybee-dark via-eazybee-dark/80 to-eazybee-dark/50" />
      
      <div className="relative z-10 px-4 py-8 sm:py-12 w-full max-w-md">
        <div className="mx-auto text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-eazybee-yellow">Eazy</span>
              <span className="text-white">Bee</span>
            </h1>
          </Link>
        </div>
        
        <div className="bg-eazybee-dark-accent/80 backdrop-blur-md rounded-xl px-6 py-8 shadow-xl border border-white/5">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1">Login to continue your journey</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-eazybee-yellow hover:bg-yellow-400 text-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </span>
                )}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-eazybee-yellow hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="text-xs text-center text-gray-400">
                  <p className="mb-2">Test accounts:</p>
                  <p>Admin: admin@eazybee.com / admin123</p>
                  <p>User: (use any valid email with password length ≥ 6)</p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
