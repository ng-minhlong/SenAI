import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up new member",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
