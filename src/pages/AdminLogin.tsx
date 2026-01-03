import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type LoginStep = "credentials" | "otp";

export default function AdminLogin() {
  const { user, loading: authLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  // 2FA State
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check if already logged in and has admin role
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!authLoading && user) {
        setCheckingRole(true);
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data && (data.role === "admin" || data.role === "super_admin")) {
          navigate("/admin");
        }
        setCheckingRole(false);
      }
    };

    checkAdminAccess();
  }, [user, authLoading, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendOTP = async () => {
    setOtpLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-admin-otp", {
        body: { action: "send", email },
      });

      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Failed to send OTP");
      }

      toast({
        title: "OTP Sent! 📧",
        description: "Check your email for the 6-digit verification code.",
      });
      setResendCooldown(60);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send OTP",
        variant: "destructive",
      });
      // Go back to credentials if OTP fails
      setLoginStep("credentials");
      await supabase.auth.signOut();
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-admin-otp", {
        body: { action: "verify", email, otp },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || "Invalid OTP");
      }

      toast({
        title: "Welcome Admin! 👋",
        description: "2FA verified. Redirecting to admin panel...",
      });
      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err.message || "Invalid OTP",
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Handle login
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // After successful login, check admin role
      const { data: { user: loggedInUser } } = await supabase.auth.getUser();
      
      if (loggedInUser) {
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", loggedInUser.id)
          .maybeSingle();

        if (roleError || !roleData || (roleData.role !== "admin" && roleData.role !== "super_admin")) {
          // Sign out if not admin
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "This account doesn't have admin privileges.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Admin verified, now send 2FA OTP
        setLoginStep("otp");
        setLoading(false);
        await sendOTP();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin-login`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Link Sent",
          description: "Check your email for a password reset link",
        });
        setShowForgotPassword(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    setLoginStep("credentials");
    setOtp("");
    await supabase.auth.signOut();
  };

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 text-primary-foreground font-heading font-bold text-2xl backdrop-blur-sm">
              PL
            </div>
            <span className="font-heading font-bold text-2xl text-primary-foreground">
              Pruthvi's Lab
            </span>
          </div>
          
          <h1 className="font-heading text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Admin
            <br />
            Control Center
          </h1>
          
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Manage content, users, and settings for Pruthvi's Lab platform. 
            Authorized administrators only.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground font-medium">Secure Access</p>
                <p className="text-primary-foreground/70 text-sm">Protected by role-based authentication</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-primary-foreground font-medium">2FA Protected</p>
                <p className="text-primary-foreground/70 text-sm">Email OTP verification required</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xl">
                PL
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                Pruthvi's Lab
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
            {loginStep === "otp" ? (
              <>
                {/* 2FA OTP Verification */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    2FA Verification
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      disabled={otpLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={verifyOTP}
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-base font-medium"
                    disabled={otpLoading || otp.length !== 6}
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Verify & Login
                      </>
                    )}
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={sendOTP}
                      disabled={resendCooldown > 0 || otpLoading}
                      className="w-full"
                    >
                      {resendCooldown > 0 
                        ? `Resend OTP in ${resendCooldown}s` 
                        : "Resend OTP"}
                    </Button>
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              </>
            ) : showForgotPassword ? (
              <>
                {/* Forgot Password Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <KeyRound className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Reset Password
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                {/* Forgot Password Form */}
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="admin@pruthvislab.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-10"
                        disabled={resetLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-base font-medium"
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Login
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Admin Login
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Enter your credentials to access the admin panel
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@pruthvislab.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Sign In to Admin
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Area</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loginStep === "otp" 
                      ? "Email OTP verification adds an extra layer of security to your admin account."
                      : "This is a restricted area. All access attempts are monitored and logged for security purposes."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} Pruthvi's Lab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
